
// Build 61 — selected Scrap Workbench design, using live recipes and models.
const previewCache61=new Map();
function preview61(id,angle=0,large=false){
 const key=id+':'+angle+':'+large;if(previewCache61.has(key))return previewCache61.get(key);
 const def=CRAFT[id]||ITEMS[id];if(!def||!def.build)return '';
 const old=renderer.getRenderTarget(),shadow=renderer.shadowMap.enabled;
 const oldColor=renderer.getClearColor?renderer.getClearColor(new THREE.Color()):null,oldAlpha=renderer.getClearAlpha?renderer.getClearAlpha():1;
 let target,g;
 try{
  g=def.build();g.rotation.y=.55+angle;g.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(g),size=bounds.getSize(new THREE.Vector3());g.position.sub(bounds.getCenter(new THREE.Vector3()));
  const scene61=new THREE.Scene();scene61.add(g,new THREE.HemisphereLight(0xfff7e7,0x6e6557,1.25));
  const sun=new THREE.DirectionalLight(0xffe8bc,1.4);sun.position.set(-3,5,4);const rim=new THREE.DirectionalLight(0xcddfe4,.7);rim.position.set(4,3,-3);scene61.add(sun,rim);
  const span=Math.max(size.x,size.y,size.z)*.72+.07,cam=new THREE.OrthographicCamera(-span,span,span,-span,.01,100);cam.position.set(3,2.2,4);cam.lookAt(0,0,0);
  const n=large?512:192;target=new THREE.WebGLRenderTarget(n,n);renderer.shadowMap.enabled=false;
  if(renderer.setClearColor)renderer.setClearColor(0x000000,0);renderer.setRenderTarget(target);renderer.render(scene61,cam);
  const bytes=new Uint8Array(n*n*4);renderer.readRenderTargetPixels(target,0,0,n,n,bytes);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=n;const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(n,n);
  for(let y=0;y<n;y++)pixels.data.set(bytes.subarray(y*n*4,(y+1)*n*4),(n-y-1)*n*4);ctx.putImageData(pixels,0,0);
  const url=canvas.toDataURL();previewCache61.set(key,url);if(previewCache61.size>36)previewCache61.delete(previewCache61.keys().next().value);return url;
 }catch(e){console.warn('Workbench preview unavailable',id);return recipePreview(id);}
 finally{renderer.setRenderTarget(old);renderer.shadowMap.enabled=shadow;if(oldColor&&renderer.setClearColor)renderer.setClearColor(oldColor,oldAlpha);if(target)target.dispose();if(g)g.traverse(o=>{if(o.geometry&&!o.userData.keepGeometry)o.geometry.dispose();});}
}
const browseRecipes61=openCraftBook;
openCraftBook=function(){
 if(!['house','scavenge','inside','explore'].includes(phase)||photo.active)return;
 if(!craftDetail40||craftMade40||!CRAFT[craftSelection]){browseRecipes61();$('modal').classList.add('workbench-browse61');return;}
 ensureLife();rememberMaterials();const id=craftSelection,c=CRAFT[id],limit=craftLimit(id),station=stationMessage(c);
 craftBatch47=Math.max(1,Math.min(craftBatch47,limit||1));let angle=0;
 const needs=Object.entries(c.needs).map(([k,q])=>{const required=q*craftBatch47,have=materialCount(k),missing=Math.max(0,required-have);return `<button class="material61 ${missing?'missing61':'ready61'}" data-material61="${k}" aria-label="${craftEscape40(ITEMS[k].name)}: have ${have}, need ${required}${missing?', missing '+missing:''}"><img src="${preview61(k)}" alt=""><strong>${ITEMS[k].name}</strong><b>${have} / ${required}</b><small>${missing?'Find '+missing+' more':'Enough'}</small></button>`;}).join('');
 const related=Object.keys(CRAFT).filter(k=>k!==id&&!CRAFT[k].collectible&&!(CRAFT[k].tool&&home.tools[k])&&!(CRAFT[k].special==='door'&&home.door)).sort((a,b)=>Number(recipeGroup(b)===recipeGroup(id))-Number(recipeGroup(a)===recipeGroup(id))).slice(0,3);
 modal('Workbench',`<div class="stage61"><img id="hero61" src="${preview61(id,0,true)}" alt="${craftEscape40(c.name)}"><button id="rotate61" aria-label="Rotate ${craftEscape40(c.name)} preview">Rotate to inspect</button></div><div class="recipe61"><h3>${c.name}</h3><p class="purpose61">${craftPurpose40(id,c)}</p><div class="materials61">${needs}</div><p id="materialHint61" role="status" class="hint61">Have / need · tap a material for a hint</p>${station?`<p class="station61">${station}</p>`:''}<p class="source61">${pantryReady()?'Uses backpack + chest':'Uses backpack materials'}</p><details class="batch61"><summary>Quantity: ${craftBatch47} · recipe options</summary>${batchControls47(id)}<button id="favorite47">${home.favoriteRecipes&&home.favoriteRecipes[id]?'Saved recipe':'Save recipe'}</button></details><button id="make61" class="primary61" ${limit?'':'disabled'}>${limit?'Craft '+(craftBatch47>1?craftBatch47+' × ':'')+c.name:station?'Station needed':'Missing materials'}</button>${!limit?'<button id="help61" class="help61">'+(station?'View required station':'Track missing materials')+'</button>':''}<button id="browse63">Choose another recipe</button><div class="relatedHeading61">Other recipes <button id="browse61">See all</button></div><div class="related61">${related.map(k=>`<button data-related61="${k}"><img src="${preview61(k)}" alt=""><span>${CRAFT[k].name}</span></button>`).join('')}</div></div>`,[]);
 $('modal').classList.add('craft-open','workbench61');$('modalClose').setAttribute('aria-label','Close workbench');
 $('rotate61').onclick=()=>{angle=(angle+Math.PI/4)%(Math.PI*2);$('hero61').src=preview61(id,angle,true);};
 $('browse61').onclick=$('browse63').onclick=()=>{craftDetail40=false;craftMade40=null;openCraftBook();};
 $('make61').onclick=()=>{if(!craftLimit(id))return;if(performCraft(id,craftBatch47)){craftMade40=id;openCraftBook();}};
 if(!limit)$('help61').onclick=()=>{if(station)fillRecipe(c.station||'workbench');else{pinnedRecipe=id;shoppingList();closeCrafting();}};
 $('modalBody').querySelectorAll('[data-related61]').forEach(b=>b.onclick=()=>fillRecipe(b.dataset.related61));
 $('modalBody').querySelectorAll('[data-material61]').forEach(b=>b.onclick=()=>{$('materialHint61').textContent=ITEMS[b.dataset.material61].name+' · '+craftHint40(b.dataset.material61);});wireBatch47();$('modalBody').scrollTop=0;
};
$('craftBook').onclick=()=>{craftMade40=null;craftDetail40=true;craftBatch47=1;if(!CRAFT[craftSelection]||CRAFT[craftSelection].collectible)craftSelection=CRAFT.lamp?'lamp':Object.keys(CRAFT).find(k=>!CRAFT[k].collectible);openCraftBook();};

