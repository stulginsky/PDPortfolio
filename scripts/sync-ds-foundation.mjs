// Applies the approved 2026-10-22 normalization using apply_patch only.
import fs from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
import {structuredPatch} from 'diff'

const ds='E:/GitHub/PDPortfolio-DS/ds'
const snapshot=JSON.parse(fs.readFileSync(ds+'/evidence/normalization-after-2026-10-22.json','utf8'))
const before=JSON.parse(fs.readFileSync(ds+'/evidence/normalization-before-2026-10-22.json','utf8'))
const vars=new Map(snapshot.variables.map(v=>[v.id,v]))
const patchExe='C:/Users/konstantin/.vscode/extensions/openai.chatgpt-26.1007.21434-win32-x64/bin/windows-x86_64/codex.exe'
function apply(text){const r=spawnSync(patchExe,['--codex-run-as-apply-patch',text],{encoding:'utf8'});if(r.status)throw Error(r.stderr||r.stdout);}
function save(file,next){
 const exists=fs.existsSync(file),old=exists?fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'):''
 next=next.replace(/\r\n/g,'\n');if(next===old)return
 if(!exists)apply('*** Begin Patch\n*** Add File: '+file+'\n+'+next.trimEnd().split('\n').join('\n+')+'\n*** End Patch')
 else {const hunks=structuredPatch(file,file,old,next,'','',{context:3}).hunks;for(const h of hunks)apply('*** Begin Patch\n*** Update File: '+file+'\n@@\n'+h.lines.filter(l=>!l.startsWith('\\')).join('\n')+'\n*** End Patch')}
 console.log(file)
}
const cssName=n=>'--'+n.replace(/[\s/]+/g,'-').toLowerCase()
const replacements=new Map()
for(const v of snapshot.variables){const prev=before.variables.find(b=>b.id===v.id);if(prev){const old=prev.codeSyntax.WEB?.match(/var\(([^)]+)\)/)?.[1];if(old&&old!==cssName(v.name)&&prev.name!=='text/link-default')replacements.set(old,cssName(v.name));}}
const sizeMap={xs:12,sm:14,base:16,lg:18,'lg-plus':20,xl:22,'xl-plus':24,'2xl':32,'3xl':48,'4xl':72}
for(const [k,v] of Object.entries(sizeMap))replacements.set('--text-size-'+k,'--text-size-'+v)
replacements.set('--decorative-turquoise','--decorative-sparrow');replacements.set('--decorative-mint','--decorative-jackdaw');replacements.set('--decorative-cyan','--decorative-robin');replacements.set('--decorative-case-bacground','--decorative-case-background-chirp-ds')
const replace=s=>s.replace(/--[a-zA-Z0-9-]+/g,m=>replacements.get(m)||m)
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)])}
const oldBase='https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod'
const newBase='https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS'
for(const file of [...files('app'),...files('storybook')].filter(f=>/\.(vue|ts|css|mdx)$/.test(f))){
 let s=fs.readFileSync(file,'utf8'),next=replace(s).replaceAll('DsCrossButton','DsBtnCross').replaceAll('ds-cross-button','ds-btn-cross')
 if(file.endsWith('.stories.ts')||file.startsWith('storybook'))next=next.replaceAll(oldBase,newBase).replaceAll('PDPortfolio-Prod','PDPortfolio-DS')
 if(file.includes('DsDropdownListItem')||file.includes('DsFullscreenMenuMob'))next=next.replace(/\bLr\b/g,'Lg').replaceAll('AppearanceLr','AppearanceLg').replaceAll('--lr','--lg')
 next=next.replaceAll('Icon right','IconRight').replaceAll('Show Icon','ShowIcon').replaceAll('Instance#968:0','Icon#968:0')
 if(file.includes('DsFilter.'))next=next.replaceAll(' (Design=2nd)','').replaceAll(', Design=2nd','')
 if(file.includes('DsCrossButton.stories'))next=next.replaceAll('Components/CrossButton','Components/BtnCross').replaceAll('cross button 290:1960','BtnCross 290:1960')
 save(file,next)
}
// Canonical component file rename, no compatibility alias.
for(const suffix of ['vue','stories.ts']){
 const old='app/components/DsCrossButton.'+suffix,newFile='app/components/DsBtnCross.'+suffix
 if(fs.existsSync(old)){save(newFile,fs.readFileSync(old,'utf8'));apply('*** Begin Patch\n*** Delete File: '+old+'\n*** End Patch');}
}
let css=fs.readFileSync('app/assets/css/tokens.css','utf8')
function cssValue(v){const val=Object.values(v.values)[0];if(val?.type==='VARIABLE_ALIAS')return 'var('+cssName(vars.get(val.id).name)+')';if(v.type==='COLOR')return 'rgb('+[val.r,val.g,val.b].map(c=>Number((c*255).toFixed(9))).join(' ')+' / '+Number((val.a??1).toFixed(9))+')';if(v.type==='STRING')return '"Roboto Flex Variable", system-ui, sans-serif';return val+(/^(text\/size-|space\/|radius\/)/.test(v.name)?'px':'')}
for(const v of snapshot.variables){
 if(v.name==='text/font-sans'||v.name.startsWith('effect/'))continue
 const name=cssName(v.name),val=cssValue(v),rx=new RegExp('('+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*:\\s*)[^;]+;')
 if(rx.test(css))css=css.replace(rx,(_,prefix)=>prefix+val+';');else css=css.replace(':root {',':root {\n  '+name+': '+val+';')
}
const canonical=snapshot.styles.map(s=>{const name=cssName(s.name.replace(/^DS\//,''));const axes=Object.entries(s.fontName.variationSettings).map(([k,v])=>'"'+k+'" '+v).join(', ');return '  '+name+'-font-variation: '+axes+';'}).join('\n')
if(!css.includes('/* Normalized Figma text styles */'))css=css.replace(':root {',':root {\n  /* Normalized Figma text styles */\n'+canonical)
save('app/assets/css/tokens.css',css)
const round=n=>Number(n.toFixed(6))
const styleRows=snapshot.styles.map(s=>[s.name,s.fontSize,s.fontName.variationSettings.wght,s.fontName.variationSettings.YOPQ,round(s.lineHeight.value),round(s.letterSpacing.value),vars.get(s.boundVariables.fontSize.id).name,s.boundVariables.fontWeight?'bound':'unbound: preserve axes'])
const table=(headers,rows)=>'| '+headers.join(' | ')+' |\n|'+headers.map(()=>'---').join('|')+'|\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n'
const variableRows=snapshot.variables.map(v=>[v.name,v.id,v.type,JSON.stringify(Object.values(v.values)[0]?.type==='VARIABLE_ALIAS'?vars.get(Object.values(v.values)[0].id).name:Object.values(v.values)[0]),v.codeSyntax.WEB,v.scopes.join(', ')||'hidden primitive'])
save(ds+'/foundation.md','# Foundation\n\nSource: [PDPortfolio-DS]('+newBase+'?node-id=0-1). Read and normalized 2026-10-22.\n\n## Rules\n\nNumeric type names are exact pixel sizes, not ranks. Example: DS/Heading/72 → text/size-72. Body Regular/Strong are independent composite styles; Strong may change weight, tracking and line height. Special Card/Badge minima keep semantic names and original fractional sizes.\n\nAll styles bind family and size. Weight is bound only when original Roboto Flex axes survive; unbound exceptions are listed below. Current values, axes and IDs remain authoritative, not the font face label.\n\nBoth collections use Morning; primitive and semantic IDs remain unchanged. CSS names mechanically replace slash/space with hyphens, lowercase. Primitives are hidden from color pickers; semantic scopes follow text/fill/stroke/effect roles. Decorative colors are not text primitives: DC text aliases green-600, showcase aliases decorative/ostrich with the same RGB.\n\n## Collections\n\n'+table(['Collection','ID','Mode','Variables'],snapshot.collections.map(c=>[c.name,c.id,c.modes.map(m=>m.name).join(', '),snapshot.variables.filter(v=>v.collection===c.id).length]))+'\n## Text styles\n\n'+table(['Style','px','wght','YOPQ','line height %','tracking %','Size token','Weight binding'],styleRows)+'\n## Variables\n\n'+table(['Name','ID','Type','Value / alias','Web syntax','Scopes'],variableRows)+'\n## Case identity exceptions\n\nChirp-Br-hero uses original outlined SVG titles and local Playfair / PT Sans for brand identity. These do not replace DS Roboto Flex. Other accepted original SVG assets, effects, hero geometry and motion remain unchanged.\n\n## Effects\n\nShadow/1st: x3.023748875 y6.047497749 blur28.725616455, shadow/color-1st. Shadow/2nd: same offsets, blur20, shadow/color-2nd. Fullscreen/Header blur: background blur30. CSS effects remain composite declarations, not invalid COLOR exports.\n')
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
const htmlTable=(heads,rows)=>'<table>\n<thead><tr>'+heads.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead>\n<tbody>\n'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('\n')+'\n</tbody>\n</table>\n'
const sampleGroup=s=>['Card','Badge'].includes(s.name.split('/')[1])?'Card / Badge':s.name.split('/')[1]
const samples=snapshot.styles.map((s,index)=>{const axes=Object.entries(s.fontName.variationSettings).map(([k,v])=>'"'+k+'" '+v).join(', ');return (index===0||sampleGroup(snapshot.styles[index-1])!==sampleGroup(s)?'## '+sampleGroup(s)+'\n\n':'')+'<section style={{marginBottom:"var(--space-6)"}}>\n<p><strong>'+esc(s.name)+'</strong></p>\n<p style={{fontFamily:"var(--text-font-sans)",fontSize:"var('+cssName(vars.get(s.boundVariables.fontSize.id).name)+')",fontWeight:'+s.fontName.variationSettings.wght+',fontVariationSettings:'+JSON.stringify(axes)+',fontOpticalSizing:"none",lineHeight:'+s.lineHeight.value/100+',letterSpacing:"'+s.letterSpacing.value/100+'em"}}>Designed &amp; Developed — Типографика</p>\n</section>'}).join('\n\n')
const colors=snapshot.variables.filter(v=>v.type==='COLOR')
const colorRows=colors.map(v=>[v.name,v.collection.includes('48:272')?'Primitive':'Semantic',Object.values(v.values)[0]?.type==='VARIABLE_ALIAS'?vars.get(Object.values(v.values)[0].id).name:cssValue(v),v.codeSyntax.WEB])
const palette=colors.map(v=>'<ColorItem title="'+v.name+'" subtitle="'+esc(v.codeSyntax.WEB)+'" colors={{value:"var('+cssName(v.name)+')"}} />').join('\n')
save('storybook/Foundation/Colors.mdx','import { Meta, ColorPalette, ColorItem } from "@storybook/addon-docs/blocks"\n\n<Meta title="Foundation/Colors" />\n\n# Colors\n\nИсточник: [PDPortfolio-DS]('+newBase+'?node-id=0-1), 2026-10-22. Все значения читаются из tokens.css. Обе коллекции используют Morning.\n\nДекоративные sparrow/jackdaw/robin/teal/waxwing/ostrich/deep-water служат оформлению. Для текста DC используется самостоятельный primitive green-600 через text/accent-dc. Link Default/Hover/Pressed — отдельные роли.\n\n'+htmlTable(['Token','Collection','Value / alias','Web syntax'],colorRows)+'\n## Palette\n\n<ColorPalette>\n'+palette+'\n</ColorPalette>\n')
save('storybook/Foundation/Typography.mdx','import { Meta } from "@storybook/addon-docs/blocks"\n\n<Meta title="Foundation/Typography" />\n\n# Typography\n\nSource: [PDPortfolio-DS]('+newBase+'?node-id=0-1), 2026-10-22.\n\nЧисло в имени — точный размер в px: DS/Heading/72 → text/size-72. Regular и Strong — самостоятельные комплексные стили. Минимумы Card/Badge сохраняют ролевые имена. Несовместимые weight bindings отключены ради сохранения исходных осей; все параметры приведены ниже.\n\n'+htmlTable(['Style','px','wght','YOPQ','lh %','ls %','Size token','Weight binding'],styleRows)+'\n'+samples+'\n')
for(const file of ['CONTRACT.md','components.md','assets.md','naming.md']){
 const p=ds+'/'+file;let next=fs.readFileSync(p,'utf8').replaceAll('DsCrossButton','DsBtnCross').replaceAll('Icon right','IconRight').replaceAll('Show Icon','ShowIcon').replaceAll('Appearance=Lr','Appearance=Lg').replaceAll('Breakpoint=Base','Breakpoint=base')
 if(file==='CONTRACT.md')next=next.replace(oldBase+'?node-id=0-1',newBase+'?node-id=0-1').replace('PDPortfolio-Prod / DS','PDPortfolio-DS').replace('**Последняя сверка:** 2026-09-26','**Последняя сверка:** 2026-10-22')
 if(!next.includes('## Normalization 2026-10-22'))next=next.replace(/^(# .+\n)/,'$1\n## Normalization 2026-10-22\n\nАктуальный источник: [PDPortfolio-DS]('+newBase+'?node-id=0-1). Текущая типографика и палитра — foundation.md; прежние датированные описания являются историей. Канонический BtnCross → DsBtnCross. IconRight=Off/On, ShowIcon/ShowDot/ShowZoom/ShowBreadcrumbs boolean; размеры Sm/Lg; Filter имеет только ось State; Filters использует base. Токены числовых размеров, scopes, Morning и исключения weight bindings описаны в normalization-2026-10-22.md.\n')
 save(p,next)
}
save(ds+'/legacy-heading-review-2026-10-22.md','# Legacy heading review\n\nDo not remap these classes to canonical DS styles without a separate decision. Numeric size token references were mechanically migrated without changing their values.\n\n'+table(['Class','Current behavior','Consumers','Decision'],[['.text-heading-3xl','24px, font-weight700 but variation wght500','No Vue consumers found','Unused but do not delete without checking external usage'],['.text-heading-4xl','48px, wght700','SiteHero name; responsive local overrides','Not DS/Heading/48 (wght600): discuss separately'],['.text-heading-xl','18px, wght600, lh130%','SiteHero role; ResumeExperienceBlock titles','Not DS/Heading/18 (lh145%): discuss separately'],['.text-heading-xl--semibold','18px and separate variation preset','SiteHero role','Keep local behavior until agreed']])+'\nRecommendation: keep exact existing appearance; later assign explicit SiteHero/Resume roles or agree a deliberate DS visual migration. No silent alias to a differently styled DS heading.\n')
