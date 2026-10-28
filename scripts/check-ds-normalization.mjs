import fs from 'node:fs'
import assert from 'node:assert/strict'
const ds='E:/GitHub/PDPortfolio-DS/ds'
const before=JSON.parse(fs.readFileSync(ds+'/evidence/normalization-before-2026-10-22.json','utf8'))
const after=JSON.parse(fs.readFileSync(ds+'/evidence/normalization-after-2026-10-22.json','utf8'))
const vars=new Map(after.variables.map(v=>[v.id,v]))
const names=new Set(),syntax=new Set()
for(const v of after.variables){
 assert(!names.has(v.name),'duplicate name '+v.name);names.add(v.name)
 const css='var(--'+v.name.replace(/[\s/]+/g,'-').toLowerCase()+')'
 assert.equal(v.codeSyntax.WEB,css);assert(!syntax.has(css),'duplicate CSS '+css);syntax.add(css)
 assert(!v.scopes.includes('ALL_SCOPES'),v.name)
 for(const value of Object.values(v.values))if(value?.type==='VARIABLE_ALIAS')assert(vars.has(value.id),'broken alias '+v.name)
}
for(const v of before.variables){if(v.name==='text/accent-dc')continue;assert.deepEqual(vars.get(v.id).values,v.values,'changed values '+v.name)}
for(const s of before.styles){
 const current=after.styles.find(x=>x.id===s.id);assert(current,'lost style '+s.id)
 for(const k of ['fontName','fontSize','lineHeight','letterSpacing'])assert.deepEqual(current[k],s[k],'changed metrics '+s.name+' '+k)
 assert(current.boundVariables.fontFamily,current.name);assert(current.boundVariables.fontSize,current.name)
 if(current.name!=='DS/Card/Description/min')assert(current.boundVariables.fontWeight,current.name)
}
assert(after.collections.every(c=>c.modes.every(m=>m.name==='Morning')))
const css=fs.readFileSync('app/assets/css/tokens.css','utf8')
for(const v of after.variables)assert(css.includes(v.codeSyntax.WEB.slice(4,-1)+':'),'missing CSS '+v.name)
assert(!fs.existsSync('app/components/DsCrossButton.vue'))
assert(fs.existsSync('app/components/DsBtnCross.vue'))
const activeFiles=['app','storybook']
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name])}
for(const f of activeFiles.flatMap(walk).filter(f=>/\.(vue|ts|mdx|css)$/.test(f))){
 const text=fs.readFileSync(f,'utf8');assert(!/DsCrossButton|--decorative-case-bacground|--text-size-(?:xs|sm|base|lg|xl)(?![\w-])/.test(text),'stale reference '+f)
}
console.log('PASS: '+after.variables.length+' variables, 21 unchanged style metrics/axes, unique CSS, aliases, scopes, Morning, migrated references; Card Description weight exception preserved')
