// Compatibility entry point: all four heroes now share the same motion contract.
import {spawnSync} from 'node:child_process'
const result=spawnSync(process.execPath,['scripts/check-hero-motion.mjs','--hero','ux'],{stdio:'inherit'})
process.exit(result.status??1)
