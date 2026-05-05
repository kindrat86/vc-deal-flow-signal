/**
 * Sync the live CSV dataset to Hugging Face + Zenodo after each prod deploy.
 *
 * Activation requires two env vars:
 *   HF_TOKEN        — Hugging Face write token (Account → Settings → Access Tokens)
 *   ZENODO_TOKEN    — Zenodo personal access token with `deposit:write` scope
 *
 * Optional:
 *   HF_DATASET_REPO — e.g. "thedatanerd/vc-deal-flow-signal" (default below)
 *   ZENODO_DEPOSIT_ID — existing deposit to version; omit to create new
 *
 * If either token is missing, the corresponding mirror is skipped
 * (not an error — lets the script be safely wired into postbuild).
 *
 * Run: npx tsx scripts/sync-dataset-mirrors.ts
 */

const HF_TOKEN = process.env.HF_TOKEN;
const HF_DATASET_REPO =
  process.env.HF_DATASET_REPO || "thedatanerd/vc-deal-flow-signal";
const ZENODO_TOKEN = process.env.ZENODO_TOKEN;
const ZENODO_DEPOSIT_ID = process.env.ZENODO_DEPOSIT_ID;
const SIGNALS_CSV_URL =
  process.env.SIGNALS_CSV_URL ||
  "https://signals.gitdealflow.com/api/signals.csv";

async function fetchCsv(): Promise<Buffer | null> {
  try {
    const res = await fetch(SIGNALS_CSV_URL);
    if (!res.ok) {
      console.log(`CSV fetch failed: HTTP ${res.status}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    console.log(`Fetched signals.csv (${buf.length} bytes)`);
    return buf;
  } catch (e) {
    console.log(`CSV fetch error: ${e}`);
    return null;
  }
}

async function pushHuggingFace(csv: Buffer): Promise<void> {
  if (!HF_TOKEN) {
    console.log("HF_TOKEN not set — skipping Hugging Face sync.");
    return;
  }
  console.log(`Uploading to huggingface.co/datasets/${HF_DATASET_REPO}...`);

  const path = "signals.csv";
  const url = `https://huggingface.co/api/datasets/${HF_DATASET_REPO}/upload/main/${path}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: new Uint8Array(csv),
    });
    if (res.ok) {
      console.log(`HF sync OK (HTTP ${res.status})`);
    } else {
      const body = await res.text();
      console.log(`HF sync failed: HTTP ${res.status} — ${body.slice(0, 200)}`);
    }
  } catch (e) {
    console.log(`HF sync error: ${e}`);
  }
}

async function pushZenodo(csv: Buffer): Promise<void> {
  if (!ZENODO_TOKEN) {
    console.log("ZENODO_TOKEN not set — skipping Zenodo sync.");
    return;
  }
  if (!ZENODO_DEPOSIT_ID) {
    console.log(
      "ZENODO_DEPOSIT_ID not set — skipping Zenodo sync (versioning requires parent deposit ID)."
    );
    return;
  }

  console.log(`Creating new Zenodo version of deposit ${ZENODO_DEPOSIT_ID}...`);

  try {
    const newVerRes = await fetch(
      `https://zenodo.org/api/deposit/depositions/${ZENODO_DEPOSIT_ID}/actions/newversion`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${ZENODO_TOKEN}` },
      }
    );
    if (!newVerRes.ok) {
      console.log(`Zenodo newversion failed: HTTP ${newVerRes.status}`);
      return;
    }
    const parent = await newVerRes.json();
    const draftId = parent.links?.latest_draft?.split("/").pop();
    if (!draftId) {
      console.log("Zenodo: could not extract new draft ID");
      return;
    }

    const draftRes = await fetch(
      `https://zenodo.org/api/deposit/depositions/${draftId}`,
      { headers: { Authorization: `Bearer ${ZENODO_TOKEN}` } }
    );
    const draft = await draftRes.json();
    const bucketUrl = draft.links?.bucket;
    if (!bucketUrl) {
      console.log("Zenodo: no bucket URL in draft");
      return;
    }

    const putRes = await fetch(`${bucketUrl}/signals.csv`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ZENODO_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: new Uint8Array(csv),
    });
    if (!putRes.ok) {
      console.log(`Zenodo upload failed: HTTP ${putRes.status}`);
      return;
    }

    const publishRes = await fetch(
      `https://zenodo.org/api/deposit/depositions/${draftId}/actions/publish`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${ZENODO_TOKEN}` },
      }
    );
    if (publishRes.ok) {
      console.log(`Zenodo sync OK — new version published as draft ${draftId}`);
    } else {
      console.log(`Zenodo publish failed: HTTP ${publishRes.status}`);
    }
  } catch (e) {
    console.log(`Zenodo sync error: ${e}`);
  }
}

async function main() {
  if (process.env.VERCEL && process.env.VERCEL_ENV !== "production") {
    console.log("Skipping dataset sync — not a production deploy.");
    return;
  }

  if (!HF_TOKEN && !ZENODO_TOKEN) {
    console.log(
      "Neither HF_TOKEN nor ZENODO_TOKEN set — dataset sync skipped."
    );
    return;
  }

  const csv = await fetchCsv();
  if (!csv) return;

  await Promise.all([pushHuggingFace(csv), pushZenodo(csv)]);
}

main().catch((e) => {
  console.log(`Dataset sync failed: ${e}`);
  process.exit(0);
});
