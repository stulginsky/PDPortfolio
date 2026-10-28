const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const index = await (await page.request.get('http://127.0.0.1:6006/index.json')).json();
  const entries = Object.values(index.entries);
  console.log(JSON.stringify({ docs: entries.filter(x=>x.type==='docs').length, stories: entries.filter(x=>x.type==='story').length, groups: [...new Set(entries.map(x=>x.title))] }));
  const results=[];
  for (const id of ['components-button--docs','components-rolefocus--docs','compositions-case-heroes-chirp-ux-hero--docs','compositions-case-heroes-chirp-ds-hero--docs','components-caseimagepreview--docs','foundation-colors--docs','foundation-spacing-radii--docs','foundation-typography--docs']) {
    const errors=[]; const handler=e=>errors.push(e.message);page.on('pageerror',handler);
    await page.goto('http://127.0.0.1:6006/iframe.html?id='+id+'&viewMode=docs');
    await page.locator('.sbdocs-content').waitFor();
    results.push(await page.evaluate(({id,errors})=>({id,errors,headings:[...document.querySelectorAll('h1,h2,h3')].map(x=>x.textContent),tables:document.querySelectorAll('table').length,markdownTableLiteral:/\|\s*-{3}/.test(document.body.innerText),text:document.body.innerText.slice(0,1000)}),{id,errors}));
    page.off('pageerror',handler);
  }
  console.log(JSON.stringify(results));
  fs.writeFileSync('E:/GitHub/PDPortfolio-DS/ds/evidence/storybook-publication-audit-2026-10-25.json',JSON.stringify({ entries, samples:results },null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
