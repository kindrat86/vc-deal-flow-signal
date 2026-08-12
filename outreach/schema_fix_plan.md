# Schema Fix Plan — JSON-LD Duplication in vs/ Pages

## Summary

Every page under `landing/vs/` has the same structured data bug: the FAQPage JSON-LD script and the BreadcrumbList JSON-LD script are each injected **4 times** into the `<head>`. This is schema spam — Google's structured data guidelines mandate one instance per entity type unless the instances describe semantically distinct entities. Repeated identical blocks risk structured data penalties or deindexing from rich results.

## Affected Files

All 7 files under `landing/vs/` share the identical bug pattern:

| File | FAQPage copies | BreadcrumbList copies |
|---|---|---|
| `landing/vs/crunchbase/index.html` | 4 (lines 31, 33, 34, 37) | 4 (lines 32, 35, 36, 38) |
| `landing/vs/pitchbook/index.html` | 4 (lines 31, 33, 34, 37) | 4 (lines 32, 35, 36, 38) |
| `landing/vs/dealroom/index.html` | 4 | 4 |
| `landing/vs/cb-insights/index.html` | 4 | 4 |
| `landing/vs/tracxn/index.html` | 4 | 4 |
| `landing/vs/privateequitywire/index.html` | 4 | 4 |
| `landing/vs/angellist/index.html` | 4 | 4 |

## Root Cause

The vs/ pages are generated from a template or build script that injects the FAQPage and BreadcrumbList script blocks once per language variant (en, es, de, x-default). Each page gets 4 copies of each schema block — one per `hreflang` declared in the `<head>` — even though all copies carry identical content and target the same canonical URL. The JSON-LD blocks themselves have no `@id` property, which makes it impossible for Google to deduplicate them as references to the same entity.

## Why This Matters

- **Google Rich Results eligibility:** FAQPage structured data qualifies for rich-result display in SERPs. Duplicate blocks cause Google to discard the schema entirely rather than pick one.
- **BreadcrumbList:** Duplicates cause confusion about which breadcrumb is canonical and may suppress breadcrumb display in search snippets.
- **Manual action risk:** Repeated identical structured data blocks are flagged as structured data spam in Google Search Console. This can trigger a manual action that removes the site from rich results across all pages.

## Fix Plan

### Step 1: Identify the generation source

Determine how the vs/ pages are built. Look for:

- A build script in `scripts/` or `tools/` that generates vs/ pages from a template
- A static site generator config (11ty, Hugo, Jekyll) with a `for` loop over `hreflang` variants that accidentally emits schema blocks per iteration
- Hand-maintained files that were copy-pasted from the same template (least likely given the uniform pattern across all 7 pages)

Check: `grep -r "FAQPage" scripts/ tools/ pseo/ --include="*.py" --include="*.js" --include="*.ts"` and `grep -r "BreadcrumbList" scripts/ tools/ pseo/ --include="*.py" --include="*.js" --include="*.ts"`.

### Step 2: Fix the template (preferred path)

If the pages are generated from a template:

1. Move the FAQPage and BreadcrumbList JSON-LD blocks **outside** the loop that iterates over hreflang/lang variants.
2. Ensure exactly **one** FAQPage script and exactly **one** BreadcrumbList script are emitted per page.
3. Add an `"@id"` property to each block for explicit deduplication:
   ```json
   {"@context":"https://schema.org","@type":"FAQPage","@id":"https://gitdealflow.com/vs/crunchbase/#faq","mainEntity":[...]}
   {"@context":"https://schema.org","@type":"BreadcrumbList","@id":"https://gitdealflow.com/vs/crunchbase/#breadcrumb","itemListElement":[...]}
   ```
4. Regenerate all 7 pages and verify each has exactly one FAQPage and one BreadcrumbList.

### Step 3: Manual fix (fallback if pages are hand-maintained)

For each of the 7 affected files, remove all but the **first** FAQPage script block and all but the **first** BreadcrumbList script block. The first instance is at lines 31 (FAQPage) and 32 (BreadcrumbList) in each file. Delete lines 33–38 from each file.

Add `"@id"` properties to the surviving blocks as shown in Step 2.

### Step 4: Fix in the pSEO Next.js site too (if applicable)

Check if `pseo-site/` also generates vs/ comparison pages:
```
find pseo-site/ -name "*.tsx" -o -name "*.jsx" | xargs grep -l "FAQPage\|BreadcrumbList"
```
If so, apply the same single-instance fix to the Next.js page components or metadata generation.

### Step 5: Verify

1. Run each page URL through Google's Rich Results Test: https://search.google.com/test/rich-results
2. Check for "FAQPage (1 detected)" and "BreadcrumbList (1 detected)" — not "multiple detected."
3. Open Google Search Console → Enhancements → FAQ and confirm no errors or warnings for the vs/ URLs.
4. After deploying the fix, request re-indexing of the affected URLs via GSC's URL Inspection tool.

### Step 6: Prevent regression

Add a check to the build/deploy pipeline that validates each vs/ page has strictly one FAQPage and one BreadcrumbList script tag:
```bash
# One-liner validation
for f in landing/vs/*/index.html; do
  faq_count=$(grep -c '"@type":"FAQPage"' "$f")
  bc_count=$(grep -c '"@type":"BreadcrumbList"' "$f")
  if [ "$faq_count" -gt 1 ] || [ "$bc_count" -gt 1 ]; then
    echo "SCHEMA SPAM: $f — FAQPage=$faq_count, BreadcrumbList=$bc_count"
    exit 1
  fi
done
```
Wire this into `.github/workflows/` or the pre-deploy hook.

## Priority

**High.** This is a structured data compliance issue that affects rich-result eligibility for all 7 comparison pages. Each page targets high-intent traffic (investors comparing GitDealFlow against incumbent platforms), making rich-result suppression a direct traffic cost.
