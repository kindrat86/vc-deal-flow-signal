import { getAllSectorCityPairs } from "@/content/sector-city";
import { getCompaniesInSectorAndCity } from "@/content/company-locations";

const pairs = getAllSectorCityPairs();
let hq = 0;
let editorialOnly = 0;
const thin: string[] = [];
for (const { sector, city } of pairs) {
  const n = getCompaniesInSectorAndCity(sector, city).length;
  if (n > 0) hq++;
  else {
    editorialOnly++;
    thin.push(`${sector}/in/${city}`);
  }
}
console.log(`TOTAL pairs: ${pairs.length}`);
console.log(`HQ-backed (keep indexed): ${hq}`);
console.log(`editorial-only / thin (noindex candidate): ${editorialOnly}`);
console.log("--- thin cells ---");
console.log(thin.join("\n"));
