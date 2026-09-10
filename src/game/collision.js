
// Collision geometry follows visible scenery; cosmetic materials never create walls.
function registerSolid62(group){group.updateWorldMatrix(true,true);group.traverse(m=>{if(!m.isMesh||!m.visible||!m.geometry||/dirt|paving|grass|flower|leaf|foliage/i.test(m.name))return;accelerate64(m);if(!surfaces57.some(s=>s.mesh===m))surfaces57.push({mesh:m,kind:/rubber/i.test(m.name)?'tyre':'solid',solid62:true});else{const s=surfaces57.find(s=>s.mesh===m);s.solid62=true;}});}
function visible62(m){for(let o=m;o;o=o.parent){if(!o.visible)return false;if(o===root)return true;}return false;}
function solidMeshes62(){return surfaces57.filter(s=>s.solid62&&visible62(s.mesh)).map(s=>s.mesh);}
function resolveGeometry62(pos,before){
 const meshes=solidMeshes62();if(!meshes.length)return;
 const move=new THREE.Vector3(pos.x-before.x,0,pos.z-before.z),length=move.length();if(length<1e-7)return;
 move.divideScalar(length);const ray=new THREE.Raycaster();let allowed=length;
 // Three offset body probes retain the rat's width without filling holes in scenery.
 for(const side of [-.13,0,.13])for(const height of [.38,.68]){
  ray.set(new THREE.Vector3(before.x-move.z*side,Math.max(before.y,pos.y)+height,before.z+move.x*side),move);ray.far=length+.14;
  const hits=ray.intersectObjects(meshes,false);
  const hit=hits.find(h=>h.face&&Math.abs(h.face.normal.clone().transformDirection(h.object.matrixWorld).y)<.65);
  if(hit)allowed=Math.min(allowed,Math.max(0,hit.distance-.14));
 }
 if(allowed<length){pos.x=before.x+move.x*allowed;pos.z=before.z+move.z*allowed;}
}
function routesResolve62(pos,before){if(!world60||world60.owner!==root)return;for(const p of world60.platforms){const bottom=p.bottom62===undefined?p.h-.16:p.bottom62;if(pos.y>=p.h-.06||pos.y+.7<=bottom)continue;const hx=p.hx+.14,hz=p.hz+.14;if(Math.abs(pos.x-p.x)>=hx||Math.abs(pos.z-p.z)>=hz)continue;if(Math.abs(before.x-p.x)>=hx)pos.x=before.x;else if(Math.abs(before.z-p.z)>=hz)pos.z=before.z;}}
function hasTop62(p){const meshes=solidMeshes62();const stamp=surfaces57.length;const cache=root.userData.collisionCache62||(root.userData.collisionCache62=new Map());const key=[p.x,p.z,p.h,stamp].join(':');if(cache.has(key))return cache.get(key);if(!meshes.length)return false;const ray=new THREE.Raycaster(new THREE.Vector3(p.x,p.h+.12,p.z),new THREE.Vector3(0,-1,0),0,.3);const ok=ray.intersectObjects(meshes,false).some(h=>h.face&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.5);cache.set(key,ok);return ok;}

