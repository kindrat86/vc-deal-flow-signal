/**
 * Manual sector corrections (2026-11-03): the topic search that assigns
 * sectors sometimes files an org under the wrong one. Applied by
 * fetch-github-data.ts before writing data/startups.json, so a weekly refresh
 * never re-introduces the error. Only moves an entry when the target sector
 * has the same period and does not already list the org.
 */
export const SECTOR_OVERRIDES: Record<string, string> = {
  "Hebbian-Robotics": "robotics", // a robotics company, was filed under data-infrastructure
};

type Snap = { startups: { name: string }[] };
type Sec = { slug: string; periods: Record<string, Snap> };

export function applySectorOverrides(sectors: Sec[]): number {
  let moved = 0;
  for (const [org, target] of Object.entries(SECTOR_OVERRIDES)) {
    const dest = sectors.find((s) => s.slug === target);
    if (!dest) continue;
    for (const src of sectors) {
      if (src.slug === target) continue;
      for (const [period, snap] of Object.entries(src.periods)) {
        const i = snap.startups.findIndex((s) => s.name === org);
        if (i < 0) continue;
        const to = dest.periods[period];
        if (!to || to.startups.some((s) => s.name === org)) continue;
        to.startups.push(snap.startups.splice(i, 1)[0]);
        moved++;
      }
    }
  }
  return moved;
}
