const fs = require('fs')
const parser = require('@babel/parser')
const profiles = ['base','min-768','min-1024','min-1280','min-1440','min-1920']
const mapResult = JSON.parse(fs.readFileSync('exports/chirp-br-source-map.json','utf8'))
const source = JSON.parse(mapResult.content[0].text)
const text = JSON.parse(fs.readFileSync('content/cases/chirp-brand.json','utf8')).hero
const roles = ['3572:2484','1464:7618','3572:2456','3572:2440','3572:2432','1464:6404']
const normalize = s => s.replace(/\s+/g,' ').trim()
const texts = Object.fromEntries(Object.entries(text).flatMap(([key,value]) => Array.isArray(value) ? value.map((s,i)=>[normalize(s),key+'.'+i]) : [[normalize(value),key]]))
const manifest = []
const unknown = new Set()
function css(classes) {
 const s={}, t={x:'0',y:'0',rotate:'0deg',skew:'0deg',flip:1}; let transform=false
 const plain = {absolute:{position:'absolute'},relative:{position:'relative'},flex:{display:'flex'},block:{display:'block'},contents:{display:'contents'},'flex-col':{flexDirection:'column'},'flex-none':{flex:'none'},'items-center':{alignItems:'center'},'items-start':{alignItems:'flex-start'},'justify-center':{justifyContent:'center'},'content-stretch':{alignContent:'stretch'},'shrink-0':{flexShrink:0},'self-stretch':{alignSelf:'stretch'},'size-full':{width:'100%',height:'100%'},'w-full':{width:'100%'},'h-full':{height:'100%'},'min-w-full':{minWidth:'100%'},'min-w-px':{minWidth:'1px'},'max-w-none':{maxWidth:'none'},'inset-0':{inset:0},'top-0':{top:0},'left-0':{left:0},'right-0':{right:0},'h-0':{height:0},'left-1/2':{left:'50%'},'mb-0':{marginBottom:0},'text-center':{textAlign:'center'},'text-right':{textAlign:'right'},'not-italic':{fontStyle:'normal'},'font-normal':{fontWeight:400},'whitespace-nowrap':{whiteSpace:'nowrap'},'overflow-hidden':{overflow:'hidden'},'pointer-events-none':{pointerEvents:'none'},'object-cover':{objectFit:'cover'}}
 for(const token of classes.split(/\s+/).filter(Boolean)) {
  if(plain[token]) {Object.assign(s,plain[token]);continue}
  if(token==='-translate-x-1/2'){t.x='-50%';transform=true;continue}
  if(token==='-translate-y-1/2'){t.y='-50%';transform=true;continue}
  if(token==='-scale-x-100'){t.flip=-1;transform=true;continue}
  if(token==='[word-break:break-word]'){s.wordBreak='break-word';continue}
  if(/^opacity-\d+$/.test(token)){s.opacity=Number(token.slice(8))/100;continue}
  const m=token.match(/^(.+?)-\[(.*)\]$/)
  if(!m){unknown.add(token);continue}
  const key=m[1];let value=m[2].replaceAll('_',' ')
  if(value.startsWith('calc('))value=value.replace(/([%\d])([+-])(?=[\d.])/g,'$1 $2 ')
  const props={w:'width',h:'height',size:'size',inset:'inset',top:'top',bottom:'bottom',left:'left',right:'right',gap:'gap',rounded:'borderRadius',leading:'lineHeight',pl:'paddingLeft',px:'paddingInline',py:'paddingBlock',tracking:'letterSpacing',shadow:'boxShadow',aspect:'aspectRatio',flex:'flex'}
  if(key==='size'){s.width=value;s.height=value}
  else if(props[key])s[props[key]]=value
  else if(key==='rotate'){t.rotate=value;transform=true}
  else if(key==='skew-x'){t.skew=value;transform=true}
  else if(key==='blur')s.filter='blur('+value+')'
  else if(key==='backdrop-blur')s.backdropFilter='blur('+value+')'
  else if(key==='text'){if(value.startsWith('color:'))s.color=value.slice(6);else if(value.startsWith('length:'))s.fontSize=value.slice(7);else if(value.startsWith('#'))s.color=value;else s.fontSize=value}
  else if(key==='font'){if(value.startsWith('family-name:'))s.fontFamily='var(--text-font-sans)';else if(value.startsWith('var('))s.fontWeight=value;else {s.fontFamily=value.includes('PT Sans')?'PT Sans':'Playfair';s.fontWeight=value.includes('Bold')?700:400}}
  else unknown.add(token)
 }
 if(transform)s.transform=`translate(${t.x},${t.y}) rotate(${t.rotate}) skewX(${t.skew}) scaleX(${t.flip})`
 return s
}
for(const [index,profile] of profiles.entries()) {
 const spec=source.variants[index]
 const old=JSON.parse(fs.readFileSync('app/components/chirp-br-hero-layout/'+profile+'.json','utf8'))
 const assets=new Map()
 function collect(n,id){id=n.id??id;if(n.asset)assets.set(id,n.asset);n.children?.forEach(c=>collect(c,id))}
 old.forEach(n=>collect(n))
 const result=JSON.parse(fs.readFileSync('exports/chirp-br-source-'+profile+'.json','utf8'))
 const code=result.content.find(c=>c.text?.startsWith('const assetPathPrefix')).text
 const prefix=code.match(/const assetPathPrefix = "([^"]+)"/)[1]
 const urls=Object.fromEntries([...code.matchAll(/const (\w+) = `\$\{assetPathPrefix\}\/([^`]+)`;/g)].map(m=>[m[1],prefix+'/'+m[2]]))
 const ast=parser.parse(code,{sourceType:'module',plugins:['typescript','jsx']})
 const fun=ast.program.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='ChirpBrHero')
 const root=fun.body.body.find(n=>n.type==='ReturnStatement').argument
 function attr(n,name){const a=n.openingElement.attributes.find(a=>a.name?.name===name);if(!a)return;return a.value?.type==='StringLiteral'?a.value.value:a.value?.expression}
 function convert(n,parentId,rootChild=false){
  const tag=n.openingElement.name.name
  let id=attr(n,'data-node-id'),name=attr(n,'data-name')
  if(tag==='RoleFocus') {id=roles[index];name='Role-Focus'}
  const geometry=spec.children.find(c=>c.id===id)
  if(rootChild&&geometry)name=geometry.name==='div'?'Role-Focus':geometry.name
  let classes=attr(n,'className');if(typeof classes!=='string')classes=''
  const out={tag:tag==='RoleFocus'?'div':tag,style:css(classes),children:[]}
  const inline=attr(n,'style');if(inline?.type==='ObjectExpression')for(const p of inline.properties)if(p.value?.type==='StringLiteral')out.style[p.key.name]=p.value.value
  if(id)out.id=id;if(name)out.name=name
  if(tag==='RoleFocus'){out.roleFocus=true;out.roleBreakpoint=index<2?'base':'min-768';return out}
  if(name==='title'){out.children=old.find(n=>n.name==='title').children;return out}
  if(tag==='img'){
   const variable=attr(n,'src')?.name,url=urls[variable],asset=assets.get(id??parentId)
   if(!url||!asset)throw Error('Unmapped asset '+profile+' '+parentId+' '+variable)
   const src=`/cases/chirp-brand/hero-layers/${profile}/${(id??parentId).replace(':','-')}/${asset.src.split('/').at(-1)}`
   out.asset={...asset,src};manifest.push({profile,id:id??parentId,path:'public'+src,url})
   return out
  }
  for(const child of n.children){if(child.type==='JSXElement')out.children.push(convert(child,id??parentId));else if(child.type==='JSXText'&&normalize(child.value)){const key=texts[normalize(child.value)];if(!key)throw Error('Unknown text '+child.value);out.children.push({text:key})}}
  return out
 }
 const layout=root.children.filter(c=>c.type==='JSXElement').map(c=>convert(c,undefined,true))
 if(layout.length!==spec.children.length)throw Error('Root count '+profile)
 fs.writeFileSync('exports/chirp-br-layout-'+profile+'.json',JSON.stringify(layout,null,1)+'\n')
}
if(unknown.size)throw Error('Unknown CSS '+[...unknown].join(','))
fs.writeFileSync('exports/chirp-br-asset-downloads.json',JSON.stringify(manifest,null,2))
console.log('Prepared6 layouts and'+manifest.length+' source asset references')
