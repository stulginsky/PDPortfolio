/** Exact critically damped spring step; the card's original geometry/poses stay authoritative. */
export type WeaponPose={ax:number;ay:number;bx:number;by:number;cx:number;cy:number}
/** Monotone Hermite interpolation: continuous pose velocity without overshooting source keys. */
export function interpolateWeaponPose(poses:readonly WeaponPose[],cursor:number):WeaponPose{
 const position=Math.max(0,Math.min(poses.length-1,cursor)),a=Math.floor(position),b=Math.min(poses.length-1,a+1),t=position-a
 function sample(key:keyof WeaponPose){
  const value=(i:number)=>poses[Math.max(0,Math.min(poses.length-1,i))]![key]
  function tangent(i:number){if(i===0)return value(1)-value(0);if(i===poses.length-1)return value(i)-value(i-1);const p=value(i)-value(i-1),n=value(i+1)-value(i);return p*n<=0?0:2*p*n/(p+n)}
  const t2=t*t,t3=t2*t
  return (2*t3-3*t2+1)*value(a)+(t3-2*t2+t)*tangent(a)+(-2*t3+3*t2)*value(b)+(t3-t2)*tangent(b)
 }
 return {ax:sample('ax'),ay:sample('ay'),bx:sample('bx'),by:sample('by'),cx:sample('cx'),cy:sample('cy')}
}
/** Register each neighbouring original image into the same interpolated screen pose. */
export function alignWeaponPose(source:WeaponPose,target:WeaponPose){
 const sx=source.bx-source.ax,sy=source.by-source.ay,ux=source.cx-source.ax,uy=source.cy-source.ay,det=sx*uy-ux*sy
 const tx=target.bx-target.ax,ty=target.by-target.ay,vx=target.cx-target.ax,vy=target.cy-target.ay
 const a=(tx*uy-vx*sy)/det,b=(ty*uy-vy*sy)/det,c=(-tx*ux+vx*sx)/det,d=(-ty*ux+vy*sx)/det
 return `matrix(${a},${b},${c},${d},${target.ax-a*source.ax-c*source.ay},${target.ay-b*source.ax-d*source.ay})`
}
export function advanceWeaponMotion(value:number,velocity:number,target:number,dt:number,omega:number){
 const offset=value-target,decay=Math.exp(-omega*dt),coefficient=velocity+omega*offset
 const next=target+(offset+coefficient*dt)*decay
 const speed=(velocity-omega*coefficient*dt)*decay
 return Math.abs(next-target)<.001&&Math.abs(speed)<.015?{value:target,velocity:0}:{value:next,velocity:speed}
}
