import {readFileSync,writeFileSync} from 'node:fs'
import {resolve,sep,isAbsolute} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash} from 'node:crypto'

const allowed=new Set([
 'PDPortfolio/app/components/dc-vendor-app-pr.scenes.json',
 'PDPortfolio/app/components/dc-vendor-app-pr.scene-context.ts',
 'PDPortfolio/app/components/dc-vendor-app-pr.geometry.ts',
 'PDPortfolio/app/components/DCVendorAppPr.vue',
 'PDPortfolio/app/components/DCVendorAppPr.stories.ts',
 'PDPortfolio/scripts/check-dc-vendor-app-pr-card-motion.mjs',
 'PDPortfolio/scripts/check-dc-vendor-app-pr-card.mjs',
 'PDPortfolio-DS/ds/dc-vendor-app-pr-card.md',
 'PDPortfolio-DS/ds/components.md',
])
const hash=bytes=>createHash('sha256').update(bytes).digest('hex')
function inside(root,path){
 if(isAbsolute(path))throw Error('Absolute checkpoint path rejected')
 const file=resolve(root,path)
 if(!file.startsWith(resolve(root)+sep))throw Error('Checkpoint path escapes its root')
 return file
}
// Validate every target and snapshot before writing any file. Later edits are never overwritten.
export function restoreResponsive({checkpoint,roots,apply=false}){
 const manifest=JSON.parse(readFileSync(resolve(checkpoint,'manifest.json'),'utf8'))
 if(manifest.version!==1||manifest.component!=='DCVendorAppPr')throw Error('Unexpected checkpoint')
 const entries=manifest.files.map(item=>{
  if(!allowed.has(item.repo+'/'+item.path)||!roots[item.repo])throw Error('Unexpected checkpoint file: '+item.path)
  const file=inside(roots[item.repo],item.path)
  const snapshot=inside(checkpoint,item.repo+'/'+item.path)
  const bytes=readFileSync(snapshot)
  if(hash(bytes)!==item.beforeSha256)throw Error('Damaged snapshot: '+item.path)
  if(!item.afterSha256)throw Error('Checkpoint is not sealed')
  const current=hash(readFileSync(file))
  const knownAfter=[item.afterSha256,...(item.acceptedAfterSha256??[])]
  if(current!==item.beforeSha256&&!knownAfter.includes(current))throw Error('Later edits detected; no files restored: '+item.repo+'/'+item.path)
  return {file,bytes,path:item.repo+'/'+item.path,restore:current!==item.beforeSha256}
 })
 if(apply)for(const entry of entries)if(entry.restore)writeFileSync(entry.file,entry.bytes)
 return entries.map(({path,restore})=>({path,status:restore?(apply?'restored':'would restore'):'already original'}))
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const args=process.argv.slice(2)
  if(args.some(arg=>arg!=='--apply'&&!/^--checkpoint=(responsive|foreground-double)$/.test(arg)))throw Error('Usage: node scripts/restore-dc-vendor-app-pr-responsive.mjs [--checkpoint=responsive|foreground-double] [--apply]')
  const main=fileURLToPath(new URL('..',import.meta.url)),ds=resolve(main,'../PDPortfolio-DS')
  const apply=process.argv.includes('--apply')
  const name=args.find(arg=>arg.startsWith('--checkpoint='))?.split('=')[1]??'responsive'
  const checkpoint=resolve(ds,'ds/evidence/dc-vendor-app-pr-responsive-rollback',name==='responsive'?'.':name)
  console.log(JSON.stringify(restoreResponsive({checkpoint,roots:{PDPortfolio:main,'PDPortfolio-DS':ds},apply}),null,2))
  if(!apply)console.log('Dry run only. Add --apply to restore the exact pre-trial implementation.')
 }catch(error){console.error(error.message);process.exitCode=1}
}

