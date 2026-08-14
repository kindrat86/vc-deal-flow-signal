/**
 * /opensearch.xml, OpenSearch 1.1 description document.
 * Lets browsers (DuckDuckGo, Brave, Vivaldi, Firefox) and aggregators
 * register the site as a searchable engine. Pairs with the
 * <link rel="search"> in the HTML head.
 *
 * Spec: https://github.com/dewitt/opensearch
 */

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                      xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>GitDealFlow</ShortName>
  <LongName>VC Deal Flow Signal, startup engineering acceleration search</LongName>
  <Description>Search venture-backed startups by GitHub engineering acceleration, sector, signal type, and period.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="32" width="32" type="image/png">${SITE}/icon.png</Image>
  <Image height="64" width="64" type="image/png">${SITE}/icon.png</Image>
  <Url type="text/html"
       method="get"
       template="${SITE}/?q={searchTerms}"/>
  <Url type="application/x-suggestions+json"
       method="get"
       template="${SITE}/api/llms-search?q={searchTerms}&amp;format=opensearch"/>
  <Url type="application/json"
       method="get"
       template="${SITE}/api/llms-search?q={searchTerms}"
       rel="results"/>
  <Url type="application/opensearchdescription+xml"
       rel="self"
       template="${SITE}/opensearch.xml"/>
  <moz:SearchForm>${SITE}/</moz:SearchForm>
  <Developer>The Data Nerd</Developer>
  <Contact>signals@gitdealflow.com</Contact>
  <Tags>vc startups github investors deal-flow alternative-data</Tags>
  <Attribution>VC Deal Flow Signal (GitDealFlow). Wikidata Q139376302. CC BY 4.0.</Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Language>en-US</Language>
</OpenSearchDescription>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
