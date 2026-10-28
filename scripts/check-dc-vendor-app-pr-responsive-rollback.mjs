import assert from 'node:assert/strict'
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs'
import {resolve,sep,dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash} from 'node:crypto'
import {restoreResponsive} from './restore-dc-vendor-app-pr-responsive.mjs'
const repo=fileURLToPath(new URL('..',import.meta.url))
const root=mkdtempSync(resolve(repo,'.tmp-pr-rollback-'))
if(!root.startsWith(resolve(repo)+sep))throw Error('Unsafe fixture root')
const roots={PDPortfolio:resolve(root,'runtime'),'PDPortfolio-DS':resolve(root,'ds')},checkpoint=resolve(root,'checkpoint')
const hash=s=>createHash('sha256').update(s).digest('hex')
const paths=['app/components/dc-vendor-app-pr.scenes.json','app/components/dc-vendor-app-pr.scene-context.ts']
try{
 const files=paths.map((path,i)=>{
  const file=resolve(roots.PDPortfolio,path),snapshot=resolve(checkpoint,'PDPortfolio',path)
  mkdirSync(dirname(file),{recursive:true});mkdirSync(dirname(snapshot),{recursive:true})
  writeFileSync(file,'trial-'+i);writeFileSync(snapshot,'original-'+i)
  return {repo:'PDPortfolio',path,beforeSha256:hash('original-'+i),afterSha256:hash('trial-'+i)}
 })
 const manifest={version:1,component:'DCVendorAppPr',files}
 writeFileSync(resolve(checkpoint,'manifest.json'),JSON.stringify(manifest))
 assert.ok(restoreResponsive({checkpoint,roots}).every(r=>r.status==='would restore'))
 assert.equal(readFileSync(resolve(roots.PDPortfolio,paths[0]),'utf8'),'trial-0','Dry run must not write')
 writeFileSync(resolve(roots.PDPortfolio,paths[1]),'future-edit')
 assert.throws(()=>restoreResponsive({checkpoint,roots,apply:true}),/Later edits/)
 assert.equal(readFileSync(resolve(roots.PDPortfolio,paths[0]),'utf8'),'trial-0','Conflict must block every write')
 writeFileSync(resolve(roots.PDPortfolio,paths[1]),'trial-1')
 writeFileSync(resolve(checkpoint,'PDPortfolio',paths[1]),'damaged')
 assert.throws(()=>restoreResponsive({checkpoint,roots,apply:true}),/Damaged snapshot/)
 assert.equal(readFileSync(resolve(roots.PDPortfolio,paths[0]),'utf8'),'trial-0')
 writeFileSync(resolve(checkpoint,'PDPortfolio',paths[1]),'original-1')
 assert.ok(restoreResponsive({checkpoint,roots,apply:true}).every(r=>r.status==='restored'))
 paths.forEach((path,i)=>assert.equal(readFileSync(resolve(roots.PDPortfolio,path),'utf8'),'original-'+i))
 assert.ok(restoreResponsive({checkpoint,roots,apply:true}).every(r=>r.status==='already original'))
 writeFileSync(resolve(checkpoint,'manifest.json'),JSON.stringify({...manifest,files:[{...files[0],path:'../../outside'}]}))
 assert.throws(()=>restoreResponsive({checkpoint,roots,apply:true}),/Unexpected checkpoint file/)
 console.log('PASS rollback: dry run, exact restoration, idempotence, later-edit/tamper/path guards and no partial writes on conflict')
}finally{rmSync(root,{recursive:true})}

