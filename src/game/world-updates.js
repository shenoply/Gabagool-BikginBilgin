// Static scenery raycasts use spatial triangle buckets, leaving rendered meshes intact.
function accelerate64(mesh){
 if(mesh.userData.raycast64||!mesh.geometry.index||Array.isArray(mesh.material))return;
 mesh.updateWorldMatrix(true,false);
 const original=mesh.raycast,geometry=mesh.geometry,pos=geometry.attributes.position,idx=geometry.index,cell=4,buckets=new Map(),v=new THREE.Vector3();
 const add=(key,a,b,c)=>{let list=buckets.get(key);if(!list)buckets.set(key,list=[]);list.push(a,b,c);};
 for(let i=0;i<idx.count;i+=3){const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)];let x0=Infinity,z0=Infinity,x1=-Infinity,z1=-Infinity;for(const k of ids){v.fromBufferAttribute(pos,k).applyMatrix4(mesh.matrixWorld);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);}const a=Math.floor(x0/cell),b=Math.floor(x1/cell),c=Math.floor(z0/cell),d=Math.floor(z1/cell);if((b-a+1)*(d-c+1)>256){add('wide',...ids);continue;}for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)add(x+','+z,...ids);}
 const chunks=new Map();for(const [key,indices]of buckets){const g=new THREE.BufferGeometry();g.setAttribute('position',pos);if(geometry.attributes.uv)g.setAttribute('uv',geometry.attributes.uv);g.setIndex(indices);g.computeBoundingSphere();g.computeBoundingBox();const proxy=new THREE.Mesh(g,mesh.material);proxy.matrixAutoUpdate=false;proxy.matrixWorld.copy(mesh.matrixWorld);chunks.set(key,proxy);}
 const matrix=mesh.matrixWorld.clone();mesh.userData.raycast64={chunks};
 mesh.raycast=function(raycaster,hits){if(this.geometry!==geometry||!this.matrixWorld.equals(matrix)||!Number.isFinite(raycaster.far)){original.call(this,raycaster,hits);return;}
 const ray=raycaster.ray,end=ray.at(raycaster.far,new THREE.Vector3()),a=Math.floor(Math.min(ray.origin.x,end.x)/cell),b=Math.floor(Math.max(ray.origin.x,end.x)/cell),c=Math.floor(Math.min(ray.origin.z,end.z)/cell),d=Math.floor(Math.max(ray.origin.z,end.z)/cell);
 if((b-a+1)*(d-c+1)>256){original.call(this,raycaster,hits);return;}
 const start=hits.length;const wide=chunks.get('wide');if(wide){wide.material=this.material;wide.raycast(raycaster,hits);}for(let x=a;x<=b;x++)for(let z=c;z<=d;z++){const proxy=chunks.get(x+','+z);if(proxy){proxy.material=this.material;proxy.raycast(raycaster,hits);}}
 for(let i=start;i<hits.length;i++)hits[i].object=this;
 };
}
// Build 65: one backpack, one recipe screen, physical water and usable home stations.
function splash65(w){
 if(!w.splash65){const g=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:0xd6f3ed,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
 const ring=new THREE.Mesh(new THREE.RingGeometry(.85,1,32),mat);ring.rotation.x=-Math.PI/2;g.add(ring);
 const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,5,4),mat,10);drops.frustumCulled=false;g.add(drops);root.add(g);w.splash65={g,mat,ring,drops,age:2};}
 const s=w.splash65;s.age=0;s.g.position.copy(w.water.position);s.g.position.y+=.012;s.g.visible=true;
 const ac=sfxCtx();if(ac){burst(ac,{f:1300,q:.3,dur:.23,vol:.07,type:'lowpass'});tone(ac,{f:360,f2:140,dur:.14,vol:.025,type:'sine'});}
}
function waterTick65(dt){const w=play43;if(!w||w.owner!==root||!rat)return;const p=rat.position,r=w.water.scale.x*.9,inside=w.water.visible&&Math.hypot(p.x-w.cup.position.x,p.z-w.cup.position.z)<r&&p.y<w.water.position.y;
 if(inside&&!w.inWater65&&w.previousY65!==undefined&&w.previousY65>=w.water.position.y&&rat.userData.vy<0)splash65(w);
 w.inWater65=inside;w.previousY65=p.y;const s=w.splash65;if(!s||s.age>1)return;s.age+=dt;s.g.visible=s.age<1;s.mat.opacity=Math.max(0,(1-s.age)*.75);s.ring.scale.setScalar(Math.min(r,.07+s.age*.6));const o=new THREE.Object3D();for(let i=0;i<10;i++){const a=i*Math.PI*2/10,spread=Math.min(r,.06+s.age*.45);o.position.set(Math.cos(a)*spread,Math.max(0,s.age*(1.8+(i%3)*.3)-s.age*s.age*4),Math.sin(a)*spread);o.scale.setScalar(1-s.age);o.updateMatrix();s.drops.setMatrixAt(i,o.matrix);}s.drops.instanceMatrix.needsUpdate=true;}
function stationModel65(fireplace=false){const g=new THREE.Group(),metal=M(fireplace?0x78534a:0x435c59),dark=M(0x192625),brass=M(0xb69b60);
 const part=(w,h,d,x,y,z,mat)=>{const m=box(w,h,d,mat);m.position.set(x,y,z);g.add(m);return m;};
 part(1.15,.14,.85,0,.07,0,metal);part(.16,.85,.8,-.5,.5,0,metal);part(.16,.85,.8,.5,.5,0,metal);part(.88,.78,.09,0,.5,-.37,dark);part(1.2,.15,.9,0,.98,0,metal);
 if(fireplace){part(.4,.7,.36,0,1.4,-.16,metal);for(const x of [-.22,.22]){const log=cyl(.07,.07,.65,wood,8);log.rotation.z=Math.PI/2;log.rotation.y=x;log.position.set(0,.23,x);g.add(log);}}
 else{part(.85,.55,.07,0,.48,.39,dark);part(.5,.05,.06,0,.76,.45,brass);for(const x of [-.33,.33]){const knob=cyl(.055,.055,.05,brass,12);knob.rotation.x=Math.PI/2;knob.position.set(x,.89,.44);g.add(knob);}for(const x of [-.28,.28]){const burner=new THREE.Mesh(new THREE.TorusGeometry(.17,.025,6,16),dark);burner.rotation.x=-Math.PI/2;burner.position.set(x,1.07,0);g.add(burner);}}
 const flame=new THREE.Group();flame.name='fire65';flame.visible=false;for(const x of [-.2,0,.2]){const f=new THREE.Mesh(new THREE.ConeGeometry(.09,.32,7),new THREE.MeshBasicMaterial({color:x===0?0xffd878:0xf0903c}));f.position.set(x,.42,fireplace?.08:.31);flame.add(f);}g.add(flame);return g;}
function outlineShape65(kind,w,h){const s=new THREE.Shape(),x=w/2;if(kind==='round'){s.absellipse(0,h/2,x,h/2,0,Math.PI*2,false,0);}else{s.moveTo(-x,0);s.lineTo(x,0);s.lineTo(x,kind==='arched'?h-x:h);if(kind==='arched')s.absarc(0,h-x,x,0,Math.PI,false);else s.lineTo(-x,h);s.lineTo(-x,0);}return s;}
function window65(kind){const g=new THREE.Group(),frame=new THREE.Mesh(new THREE.ShapeGeometry(outlineShape65(kind,1.25,1.35),24),M(0x896e50,{side:THREE.DoubleSide}));frame.position.y=-.675;g.add(frame);const glass=new THREE.Mesh(new THREE.ShapeGeometry(outlineShape65(kind,1.03,1.13),24),M(0x96bcc7,{emissive:0x354952,emissiveIntensity:.45,side:THREE.DoubleSide}));glass.position.set(0,-.565,.015);g.add(glass);for(const [w,h]of [[.055,1.1],[1.04,.055]]){const bar=box(w,h,.05,M(0x896e50));bar.position.z=.045;g.add(bar);}return g;}
function door65(kind){const g=new THREE.Group(),leaf=new THREE.Mesh(new THREE.ExtrudeGeometry(outlineShape65(kind,1.18,2.2),{depth:.08,bevelEnabled:false,steps:1,curveSegments:18}),MT(0x785438,'wood'));g.add(leaf);for(const y of [.4,1.6]){const rail=box(1.1,.09,.04,M(0x503d2c));rail.position.set(0,y,.11);g.add(rail);}const handle=new THREE.Mesh(new THREE.TorusGeometry(.07,.016,6,16),M(0xbca56b));handle.position.set(.4,1,.15);g.add(handle);return g;}
Object.assign(CRAFT,{
 oven65:{name:'Salvaged tin oven',needs:{can:3,foil:2,nail:3},bench:true,r:.68,build:()=>stationModel65(false)},
 fireplace65:{name:'Hearth fireplace',needs:{pebble:6,can:1,stick:3},bench:true,r:.7,build:()=>stationModel65(true)},
 recordplayer65:{name:'Homemade vinyl player',needs:{book:1,can:1,button:2,nail:2,string:2},bench:true,r:.65,build:turntable60},
 toast65:{name:'Oven-baked crumbs',needs:{crumbs:3,stick:1},station:'oven65',result:'snack',build:()=>ITEMS.snack.build()},
 windowSquare65:{name:'Square window',needs:{stick:4,foil:2},wall:true,r:.7,build:()=>window65('square')},
 windowRound65:{name:'Round window',needs:{stick:4,string:2,foil:2},wall:true,r:.7,build:()=>window65('round')},
 windowArch65:{name:'Arched window',needs:{stick:5,foil:2},wall:true,r:.7,build:()=>window65('arched')},
 doorSquare65:{name:'Panelled door',needs:{stick:6,nail:2},doorStyle65:'square',bench:true,r:.65,build:()=>door65('square')},
 doorArch65:{name:'Arched door',needs:{stick:7,nail:2,string:1},doorStyle65:'arched',bench:true,r:.65,build:()=>door65('arched')}
});
CRAFT.workbench.name='Crafting table';
function refreshDoor65(){if(phase!=='house'||!world60?.door)return;const pivot=world60.door;while(pivot.children.length){const old=pivot.children[0];pivot.remove(old);old.traverse(m=>{if(m.geometry&&!m.userData.keepGeometry)m.geometry.dispose();});}const leaf=home.doorStyle65?door65(home.doorStyle65):brownDoor60();leaf.rotation.z=0;leaf.position.x=.59;pivot.add(leaf);if(hs.house.userData.parts.door)hs.house.userData.parts.door.visible=false;}
const craftBase65=performCraft;performCraft=function(id,count=1){if(!craftBase65(id,count))return false;const c=CRAFT[id];if(c.doorStyle65){home.doorStyles65=home.doorStyles65||{};home.doorStyles65[c.doorStyle65]=true;home.doorStyle65=c.doorStyle65;delete home.storage[id];home.door=true;rebuildHouse();refreshDoor65();save();}return true;};
stationMessage=function(c){if(c.bench&&!benchReady())return 'Craft and place a Crafting table at home.';if(c.station){const okay=phase==='house'&&(placed(c.station)||(c.station==='cookstove'&&placed('oven65')));if(!okay)return 'Place '+(CRAFT[c.station]?.name||'a cooking station')+' at home.';}return '';};
function playVinyl65(edition=0){music69.index=edition%music69.tracks.length;radioStop();stopPianoNodes();piano.enabled=true;piano.step=0;recordEdition60=edition;$('pianoToggle').textContent='Music: vinyl';schedulePiano();closeModal();}
function useStation65(entry){const id=entry.p.id;if(id==='workbench'){craftDetail40=false;craftMade40=null;openCraftBook();return;}if(id==='recordplayer65'){musicMenu69();return;}if(false){ensure60();modal('Vinyl player','<p>Your handmade player includes Ode to Joy. Find rare records to expand your collection.</p>',[['Play Ode to Joy',()=>playVinyl65(0)],...['vinyl60','vinyl61','vinyl62'].filter(k=>home.discoveries60[k]).map((k,i)=>[CRAFT[k].name,()=>playVinyl65(i)]),['Stop music',()=>{piano.enabled=false;stopPianoNodes();closeModal();}]]);return;}
 if(id==='oven65'){modal('Tin oven','<p>Turn scavenged ingredients into food.</p>',[['Bake crumbs',()=>fillRecipe('toast65')],['Cook seed stew',()=>fillRecipe('seedstew')]]);return;}
 const lit=(entry.m.userData.fireTime65||0)>0;modal('Hearth fireplace',`<p>${lit?'The fire is drying your fur and restoring energy.':'Burn one twig for a minute of warmth. Stay nearby to dry off and recover energy.'}</p>`,[[lit?'Add a twig · +60 seconds':'Light fire · 1 twig',()=>{if(consumeMaterials({stick:1})){entry.m.userData.fireTime65=(entry.m.userData.fireTime65||0)+60;bag();save();closeModal();sfx.step('wood');}},materialCount('stick')<1],...(lit?[['Extinguish',()=>{entry.m.userData.fireTime65=0;closeModal();}]]:[])]);}
function stationsTick65(dt){if(phase!=='house'||!hs)return;for(const e of hs.placed){if(e.p.id!=='fireplace65')continue;const u=e.m.userData;u.fireTime65=Math.max(0,(u.fireTime65||0)-dt);const flame=e.m.getObjectByName('fire65');if(flame){flame.visible=u.fireTime65>0;flame.scale.y=.9+Math.sin(t*11)*.1;}if(u.fireTime65>0&&Math.hypot(rat.position.x-e.p.x,rat.position.z-e.p.z)<2){home.wet=Math.max(0,(home.wet||0)-dt*3);const l=ensureLife();l.stamina=Math.min(100,l.stamina+dt*5);}}}
const furnitureBase65=furnitureMenu;furnitureMenu=function(entry){if(['workbench','oven65','fireplace65','recordplayer65'].includes(entry.p.id)){modal(CRAFT[entry.p.id].name,'<p>Use your station or rearrange it.</p>',[['Use',()=>useStation65(entry)],['Move',()=>moveFurniture(entry)],['Paint / style',()=>styleFurniture(entry)],['Store',()=>{closeModal();storeFurniture(entry);}]]);}else furnitureBase65(entry);};
function category65(id){if(['workbench','oven65','fireplace65','cookstove','recordplayer65'].includes(id))return 'stations';const c=CRAFT[id];return c.tool?'tools':c.result&&FOODS[c.result]?'food':c.result?'materials':'home';}
let filter65='all',query65='',page65=0;
function pickRecipe65(id){craftSelection=id;craftDetail40=true;craftMade40=null;craftBatch47=1;openCraftBook();}
openCraftBook=function(){if(!['scavenge','explore','house','inside'].includes(phase)||photo.active)return;ensureLife();rememberMaterials();
 if(craftMade40){const id=craftMade40,c=CRAFT[id];modal('Made it!',`<img class="hero65" src="${preview61(id)}" alt="${craftEscape40(c.name)}"><h3>${c.name}</h3><p>${c.doorStyle65?'Your new door is installed.':c.tool?'Your upgrade is equipped.':c.result?'Your supplies have been added.':'Stored safely in Furniture.'}</p>`,[...(phase==='house'&&!c.tool&&!c.result&&!c.special&&!c.doorStyle65?[['Place now',()=>{closeModal();beginPlace(id,'storage');}]]:[]),['More recipes',()=>{craftMade40=null;craftDetail40=false;openCraftBook();}]]);$('modal').classList.add('simple65');return;}
 if(craftDetail40&&CRAFT[craftSelection]){const id=craftSelection,c=CRAFT[id],ready=craftLimit(id)>0,station=stationMessage(c);modal(c.name,`<img class="hero65" src="${preview61(id,0,true)}" alt="${craftEscape40(c.name)}"><p>${c.doorStyle65?'Replaces the door at home.':id==='fireplace65'?'Burn twigs to dry off and restore energy.':id==='oven65'?'Bake crumbs and cook seed stew.':id==='recordplayer65'?'Play Beethoven and your collected records.':c.wall?'Craft, then mount it on a wall at home.':craftPurpose40(id,c)}</p><div class="ingredients65">${Object.entries(c.needs).map(([k,q])=>`<div class="${materialCount(k)>=q?'enough65':'missing65'}"><img src="${preview61(k)}" alt=""><span>${ITEMS[k].name}<b>${materialCount(k)} / ${q}</b></span></div>`).join('')}</div><p class="status65">${station|| (ready?'Ready to craft':'Collect the missing materials')} · ${pantryReady()?'Bag + chest':'Bag materials'}</p>`,[['← Recipes',()=>{craftDetail40=false;openCraftBook();}],['Craft',()=>{if(performCraft(id,1)){craftMade40=null;closeModal();sayToast(c.name+' crafted');}},!ready],...(!ready?[[station?'View required station':'Track materials',()=>{if(station)pickRecipe65(c.station||'workbench');else{pinnedRecipe=id;shoppingList();closeModal();sayToast('Materials tracked — check your Bag.');}}]]:[])]);$('modal').classList.add('simple65');return;}
 const preferred=['workbench','oven65','fireplace65','recordplayer65','windowSquare65','windowRound65','windowArch65','doorSquare65','doorArch65'];const all=[...preferred,...Object.keys(CRAFT).filter(id=>!preferred.includes(id))].filter(id=>!CRAFT[id].collectible&&!(CRAFT[id].tool&&home.tools[id])&&!(CRAFT[id].special==='door'&&home.door)&&(filter65==='all'||category65(id)===filter65)&&CRAFT[id].name.toLowerCase().includes(query65.toLowerCase()));const pages=Math.max(1,Math.ceil(all.length/8));page65=Math.min(page65,pages-1);const ids=all.slice(page65*8,page65*8+8);
 modal('Craft',`<input id="search65" class="search65" placeholder="Find a recipe…" aria-label="Find a recipe" value="${craftEscape40(query65)}"><div class="tabs65">${[['all','All'],['stations','Stations'],['home','Home'],['food','Food'],['tools','Tools'],['materials','Materials']].map(([k,n])=>`<button data-filter65="${k}" aria-pressed="${filter65===k}">${n}</button>`).join('')}</div><div class="recipes65">${ids.map(id=>`<button data-recipe65="${id}"><img src="${preview61(id)}" alt=""><strong>${CRAFT[id].name}</strong><small>${craftLimit(id)>0?'Ready to craft':stationMessage(CRAFT[id])?'Station needed':'Find materials'}</small></button>`).join('')||'<p>No recipes match.</p>'}</div>`,[['Previous',()=>{page65--;openCraftBook();},page65===0],[(page65+1)+' / '+pages,()=>{},true],['Next',()=>{page65++;openCraftBook();},page65+1>=pages]]);$('modal').classList.add('simple65');$('modalBody').querySelectorAll('[data-recipe65]').forEach(b=>b.onclick=()=>pickRecipe65(b.dataset.recipe65));$('modalBody').querySelectorAll('[data-filter65]').forEach(b=>b.onclick=()=>{filter65=b.dataset.filter65;page65=0;openCraftBook();});$('search65').oninput=()=>{const input=$('search65'),pos=input.selectionStart;query65=input.value;page65=0;openCraftBook();$('search65').focus();$('search65').setSelectionRange(pos,pos);};
};
function finishes65(field){const options=field==='floor'?FLOORS:WALLS;modal(field==='floor'?'Floor finishes':'Wall paint','<p>Choose a finish. The material cost is shown beside it.</p>',options.map(o=>[o.name+(home[field]===o.id?' · selected':' · '+(Object.entries(o.cost).map(([k,n])=>n+' '+ITEMS[k].name).join(', ')||'free')),()=>{if(home[field]!==o.id&&consumeMaterials(o.cost)){home[field]=o.id;rebuildHouse();refreshDoor65();save();bag();}finishes65(field);},home[field]!==o.id&&!Object.entries(o.cost).every(([k,n])=>materialCount(k)>=n)]));}
homeMenu63=function(){if(phase!=='house')return;ui.hb.style.display='none';modal('Your home','<p>Make this little place yours.</p>',[['Place furniture',()=>chest60('furniture')],['Wall paint',()=>finishes65('wall')],['Floor finish',()=>finishes65('floor')],['Window shapes',()=>{filter65='home';query65='window';page65=0;craftDetail40=false;craftMade40=null;openCraftBook();}],['Door shapes',()=>{modal('Your door','<p>Craft a new shape or fit one you already own.</p>',[['Craft a door',()=>{filter65='home';query65='door';craftDetail40=false;craftMade40=null;openCraftBook();}],...Object.keys(home.doorStyles65||{}).map(k=>[k==='arched'?'Fit arched door':'Fit panelled door',()=>{home.doorStyle65=k;refreshDoor65();save();closeModal();}])]);}],['Storage chest',()=>chest60()]]);};
function menu65(){modal('Menu','<p>Keep exploring at your own pace.</p>',[['Home & decorating',()=>{if(phase==='house')homeMenu63();else{closeModal();startHouse();}}],['Travel',openMap],['Weather',()=>{closeModal();$('weather42').click();}],['Music playlist',musicMenu69],[$('mute').textContent,()=>{$('mute').click();menu65();}],[$('quality').textContent,()=>{$('quality').click();menu65();}],['Camera',()=>modal('Camera','<p>Drag the view to orbit. Pinch to zoom.</p>',[['Zoom out',()=>{closeModal();zoomGame(1.22);}],['Zoom in',()=>{closeModal();zoomGame(.82);}],['Reset view',()=>{cameraReset();closeModal();}],['Photo mode',()=>{closeModal();$('photo').click();}]])]]);}
$('menu65').onclick=menu65;$('bag').onclick=openSupplies;$('homePanelToggle').onclick=homeMenu63;$('craftBook').onclick=()=>{craftDetail40=false;craftMade40=null;filter65='all';query65='';page65=0;openCraftBook();};
bag=function(){ensureLife();rememberMaterials();shoppingList();ui.bag.textContent='Bag '+totalBag()+' / '+bagCapacity();ui.bag.setAttribute('aria-label','Open bag, '+totalBag()+' of '+bagCapacity()+' parts used');};
// Returning home decorations cannot silently bypass backpack capacity.
function returnParts65(parts){ensure60();for(const [id,n]of Object.entries(parts)){const fit=Math.max(0,Math.min(n,bagCapacity()-totalBag()));if(fit)inv[id]=(inv[id]||0)+fit;if(n>fit)home.pantry[id]=(home.pantry[id]||0)+n-fit;}}
storeFurniture=function(entry){undo41=[];const id=entry.p.id;removePlaced(entry);if(CRAFT[id])home.storage[id]=(home.storage[id]||0)+1;else returnParts65({[id]:1});save();bag();renderPanel();sayToast('Stored safely. Extra materials go to your chest.');};
recycleFurniture=function(entry){undo41=[];const id=entry.p.id;if(CRAFT[id]?.collectible){storeFurniture(entry);return;}removePlaced(entry);returnParts65(CRAFT[id]?CRAFT[id].needs:{[id]:1});save();bag();renderPanel();sayToast('Materials recovered. Anything beyond bag capacity is in your chest.');};

function tracked65(){if(!pinnedRecipe||!CRAFT[pinnedRecipe])return '';const c=CRAFT[pinnedRecipe];return '<div class="track65"><strong>Tracking: '+craftEscape40(c.name)+'</strong><p>'+Object.entries(c.needs).map(([k,n])=>craftEscape40(ITEMS[k].name)+' '+materialCount(k)+' / '+n).join(' · ')+'</p></div>';}
const cancelBase65=cancelPlace;cancelPlace=function(){cancelBase65();if(phase==='house'&&hs&&!hs.sel){ui.hb.style.display='none';home.panelOpen=false;}};

// Contextual locomotion on Pip's existing skeleton; no replacement character asset.
function motions66(u){
 const make=(name,swim)=>{const times=[0,.3,.6,.9,1.2],tracks=[];for(const side of ['Left','Right'])for(const limb of ['Arm','ForeArm','UpLeg','Leg']){const key=side+limb,base=u.pipRest[key];if(!base)continue;const values=[];for(const time of times){const wave=Math.sin(time/1.2*Math.PI*2+(side==='Left'?0:Math.PI));const x=limb==='Arm'?(swim?-.65+wave*.7:-1.15+wave*.5):limb==='ForeArm'?-.65-Math.max(0,wave)*.5:limb==='UpLeg'?wave*(swim?.3:.55):.35-Math.min(0,wave)*.55;const q=base.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x,0,0)));values.push(q.x,q.y,q.z,q.w);}tracks.push(new THREE.QuaternionKeyframeTrack(key+'.quaternion',times,values));}const clip=new THREE.AnimationClip(name,1.2,tracks);u.pipActions[name]=u.pipMixer.clipAction(clip);};make('RopeClimb66',false);make('Swim66',true);
}
function waterVolume66(p){const w=play43;if(!w||w.owner!==root||!w.water.visible||w.water.position.y<.38)return null;return Math.hypot(p.x-w.cup.position.x,p.z-w.cup.position.z)<w.water.scale.x*.91?w.water:null;}
function float66(){const u=rat.userData,w=waterVolume66(rat.position);u.swim66=!!(w&&!u.rope66&&!u.wallState&&!(u.air&&u.vy>0)&&rat.position.y<w.position.y-.1);if(!u.swim66)return false;rat.position.y=w.position.y-.16;u.air=false;u.vy=0;u.run=false;u.floor57=rat.position.y;return true;}
function seedRope66(){if(phase!=='scavenge'||!world60)return;const g=new THREE.Group(),mat=M(0xae9470);const rope=cyl(.025,.025,2.9,mat,8);rope.position.y=1.45;g.add(rope);for(let i=0;i<7;i++){const knot=new THREE.Mesh(new THREE.TorusGeometry(.037,.016,6,10),mat);knot.rotation.x=Math.PI/2;knot.position.y=.18+i*.4;g.add(knot);}g.position.set(-4.8,0,31.06);g.name='Knotted climbing rope';root.add(g);world60.rope66={g,x:-4.8,z:31.06,h:2.6};}
function ropeNear66(){const r=world60?.owner===root&&world60.rope66;if(!r||!rat||rat.userData.swim66)return null;return Math.hypot(rat.position.x-r.x,rat.position.z-r.z)<.7&&rat.position.y<r.h+.3?r:null;}
function grabRope66(){const r=ropeNear66();if(!r)return false;const u=rat.userData;u.rope66=r;if(wallPanel)wallPanel.style.display='none';u.wallState=null;u.climb=null;u.act=null;u.air=false;u.vy=0;u.motionX=u.motionZ=0;rat.position.x=r.x;rat.position.z=r.z-.12;rat.rotation.y=0;return true;}
function ropeControl66(dt){const u=rat.userData,r=u.rope66;if(!r)return null;if(!gameplayActive())return 0;const move=keys.w||keys.arrowup||joy.z<-.2?1:keys.s||keys.arrowdown||joy.z>.2?-1:0;u.ropeMoving66=move!==0;u.ropeTime66=(u.ropeTime66||0)+dt*move*5;u.ropeDirection66=move;u.vel=Math.abs(move);rat.position.y=Math.max(0,rat.position.y+move*dt*1.05);if(rat.position.y>=r.h){u.rope66=null;u.climb={t:0,from:rat.position.clone(),to:new THREE.Vector3(r.x,r.h,31.8)};}else if(move<0&&rat.position.y===0){u.rope66=null;rat.position.z=r.z-.4;u.air=false;}return Math.abs(move)*.5;}
function dropRope66(){if(!rat?.userData.rope66)return false;const u=rat.userData;u.rope66=null;u.ropeMoving66=false;u.air=true;u.vy=2.5;u.drop62=.5;rat.position.z-=.22;return true;}

const birdLines66=[
 ['Councillor Crumb','I promise every bird a bigger nest and a shorter winter.'],
 ['Opposition pigeon','You promised that last spring. We got a parking meter.'],
 ['The independent','I vote for whoever opens the dumpster.'],
 ['Councillor Crumb','The council has approved a tax on shiny things.'],
 ['Opposition pigeon','Typical. The crows already own everything.'],
 ['The independent','Can we debate the actual issue? Someone ate my bread.']
];
function stop66(){stopVoice69();if(sound66.loop){try{sound66.loop.src.stop();}catch(e){}sound66.loop.src.disconnect();sound66.loop.filter.disconnect();sound66.loop.gain.disconnect();sound66.loop.pan.disconnect();sound66.loop=null;}if(sound66.utterance&&'speechSynthesis'in window)speechSynthesis.cancel();sound66.utterance=null;sound66.voicePos=null;sound66.voiceClock=0;$('chatter66').style.display='none';}
function voice66(name,line,pos,pitch=1){return ambientVoice69(name,line,pos);}
function meow66(pos){ambientVoice69('Zaytona','Meow? Oh, honestly.',pos); }
function tick66(dt){if(gameplayActive())ropeHints66();
 if(!rat||!['scavenge','explore','house','inside'].includes(phase)||document.hidden||!voiceOn||!gameplayActive()){stop66();return;}
 if(sound66.owner!==root){stop66();Object.assign(sound66,{owner:root,clock:0,dogNear:false,dogCooldown:0,catNear:false,catCooldown:0,birdCooldown:6,birdLine:0,horn:14});}
 sound66.clock+=dt;sound66.dogCooldown=Math.max(0,sound66.dogCooldown-dt);sound66.catCooldown=Math.max(0,sound66.catCooldown-dt);sound66.birdCooldown=Math.max(0,sound66.birdCooldown-dt);
 sound66.voiceClock=Math.max(0,sound66.voiceClock-dt);if(!sound66.voiceClock){if(sound66.utterance?.recorded69)stopVoice69();$('chatter66').style.display='none';if(sound66.utterance){if('speechSynthesis'in window)speechSynthesis.cancel();sound66.utterance=null;}}
 const outdoor=outdoors42(),ac=sfxCtx();if(outdoor&&ac&&ac.state!=='suspended'){
  if(!sound66.loop){const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain(),pan=ac.createStereoPanner?ac.createStereoPanner():ac.createGain();src.buffer=noiseBuf(ac,4);src.loop=true;filter.type='lowpass';filter.frequency.value=250;gain.gain.value=.009;src.connect(filter).connect(gain).connect(pan).connect(ac.destination);src.start();sound66.loop={src,filter,gain,pan};}
  const c=sound66.loop,pass=(Math.sin(sound66.clock*.18)+1)/2;c.gain.gain.setTargetAtTime(.006+pass*.012,ac.currentTime,.4);c.filter.frequency.setTargetAtTime(180+pass*220,ac.currentTime,.4);if(c.pan.pan)c.pan.pan.setTargetAtTime(Math.sin(sound66.clock*.09)*.8,ac.currentTime,.4);sound66.horn-=dt;if(sound66.horn<=0){sound66.horn=24+Math.random()*25;tone(ac,{f:196,dur:.28,vol:.012,type:'triangle'});tone(ac,{f:247,dur:.22,delay:.08,vol:.008,type:'triangle'});}
 }
 const dog=actors44.find(a=>a.owner===root&&a.id==='hound'),nearDog=!!dog&&dog.g.position.distanceTo(rat.position)<5;if(nearDog&&sound66.dogCooldown===0){effect58('dog',dog.g.position);sound66.dogCooldown=sound66.dogNear?24:12;}sound66.dogNear=nearDog;
 const cat=zaytona&&zaytona.owner===root?zaytona:null,nearCat=!!cat&&cat.g.position.distanceTo(rat.position)<4.2;if(nearCat&&sound66.catCooldown===0&&!sound66.utterance){meow66(cat.g.position);if(Math.floor(sound66.clock/20)%3===1)voice66('Zaytona','Mee-ow? Oh, honestly.',cat.g.position,1.3);sound66.catCooldown=18+Math.random()*10;}sound66.catNear=nearCat;
 const birds=actors44.find(a=>a.owner===root&&a.id==='songbirds');if(birds&&birds.g.position.distanceTo(rat.position)<6&&sound66.birdCooldown===0&&!sound66.utterance){const [name,line]=birdLines66[sound66.birdLine%birdLines66.length];voice66(name,line,birds.g.position,[1.25,.85,1.6][sound66.birdLine%3]);sound66.birdLine++;sound66.birdCooldown=10+(sound66.birdLine%3===0?25:0);}
 if(sound66.voicePos&&sound66.voicePos.distanceTo(rat.position)>8){stopVoice69();if(sound66.utterance&&'speechSynthesis'in window)speechSynthesis.cancel();sound66.utterance=null;sound66.voicePos=null;sound66.voiceClock=0;$('chatter66').style.display='none';}

}
const interactBase66=interact60;interact60=function(){if(rat?.userData.rope66)return dropRope66();if(ropeNear66()&&grabRope66())return true;return interactBase66();};

function ropeHints66(){ const rope=ropeNear66();if(rat.userData.rope66){ui.prompt.style.display='block';ui.prompt.textContent='Move up / down to climb · Jump to let go';$('padE').textContent='Let go';}else if(rope&&!rat.userData.climb&&!rat.userData.wallState){ui.prompt.style.display='block';ui.prompt.textContent='Grab the knotted rope';$('padE').textContent='Climb';}}
// Keep the small paws on the rope while the supplied skeleton changes pose.
function ropeHands66(g){const u=g.userData,r=u.rope66;if(!r||!u.pipBones)return;g.updateWorldMatrix(true,true);for(const side of ['Left','Right']){const arm=u.pipBones[side+'Arm'],fore=u.pipBones[side+'ForeArm'],hand=u.pipBones[side+'Hand'];if(!arm||!fore||!hand)continue;const target=new THREE.Vector3(r.x+(side==='Left'?.012:-.012),g.position.y+.385+Math.sin((u.ropeTime66||0)+(side==='Left'?0:Math.PI))*.018,r.z-.01);for(let i=0;i<5;i++)for(const bone of [fore,arm]){const origin=bone.getWorldPosition(new THREE.Vector3()),from=hand.getWorldPosition(new THREE.Vector3()).sub(origin).normalize(),to=target.clone().sub(origin).normalize(),delta=new THREE.Quaternion().setFromUnitVectors(from,to),world=bone.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(delta.multiply(world)));bone.updateWorldMatrix(false,true);}}}

// Authored animation pack: the controller owns world motion, clips own poses.
function normalize67(c,hip){
 const controlled=['Ledge_Pull_Up','Ledge_Grab','Ledge_Hang_Loop'];
 for(const tr of c.tracks){if(tr.name==='Hips.position'&&controlled.includes(c.name))for(let i=1;i<tr.values.length;i+=3)tr.values[i]=hip.values[1];}
 return c;
}
function once67(name){return name&&!name.endsWith('_Loop')&&!['Idle','Walk','Run','Sprint','Jog','Push','Climb','ClimbDown','Side','SideStill'].includes(name);}
function setup67(u){
 const src=u.pipActions.Tail_Idle_Sway_Loop?.getClip();if(src){const clip=new THREE.AnimationClip('TailOverlay67',src.duration,src.tracks.filter(t=>/^Tail_\d+\./.test(t.name)).map(t=>t.clone()));u.tail67=u.pipMixer.clipAction(clip).play();}
 u.idleClock67=0;u.idleIndex67=0;u.senseClock67=0;u.alertCD67=0;
}
function sequence67(g,names,options={}){if(!g?.userData.pipActions)return false;const u=g.userData;if(u.job67?.lock)return false;const clips=names.filter(n=>u.pipActions[n]);if(!clips.length)return false;u.job67={clips,index:0,time:0,...options};u.idleClock67=0;return true;}
function input67(){return !!(keys.w||keys.s||keys.a||keys.d||keys.arrowup||keys.arrowdown||keys.arrowleft||keys.arrowright||Math.hypot(joy.x,joy.z)>.15);}
function sense67(g){
 const u=g.userData;u.cover67=false;u.gap67=false;if(!['scavenge','inside','explore'].includes(phase)||u.air)return;
 const origin=g.position.clone().add(new THREE.Vector3(0,.38,0));
 const hits=(dir,far)=>{const ray=new THREE.Raycaster(origin,dir,0,far);let d=Infinity;for(const s of surfaces57){if(!s.mesh||!visible62(s.mesh))continue;const hit=ray.intersectObject(s.mesh,false)[0];if(hit)d=Math.min(d,hit.distance);}return d;};
 u.cover67=hits(new THREE.Vector3(0,1,0),.5)<.5;
 const side=new THREE.Vector3(Math.cos(g.rotation.y),0,-Math.sin(g.rotation.y));u.gap67=hits(side,.43)<.43&&hits(side.clone().negate(),.43)<.43;
}
function motion67(g,dt,speed,base,act){
 const u=g.userData;const active=gameplayActive();u.heavy67=g===rat&&invCount()>=45;if(!active)dt=0;
 u.alertCD67=Math.max(0,(u.alertCD67||0)-dt);
 const moving=input67()||speed>.07;
 if(u.job67&&!u.job67.lock&&(moving||u.air||u.rope66||u.wallState||u.climb||u.pick||act))u.job67=null;
 // Dry-land reaction only after leaving actual water, never during a jump.
 if(u.swim66)u.wasWet67=true;
 if(u.wasWet67&&!u.swim66&&!u.air&&!u.job67&&!moving){u.wasWet67=false;sequence67(g,['Shake_Off_Water']);home.wet=Math.max(0,(home.wet||0)-8);if(voiceOn)sfx.step('water');}
 u.senseClock67=(u.senseClock67||0)-dt;if(u.senseClock67<=0&&active){u.senseClock67=.25;sense67(g);}
 if(!u.job67&&!u.air&&!u.climb&&!u.wallState&&!u.rope66&&!u.swim66&&!act&&!u.pick){
  if(u.cover67&&!u.inCover67){u.inCover67=true;sequence67(g,['Hide_Enter']);}
  else if(!u.cover67&&u.inCover67){u.inCover67=false;sequence67(g,['Hide_Exit']);}
  if(u.gap67&&!u.inGap67){u.inGap67=true;sequence67(g,['Squeeze_Enter']);}
  else if(!u.gap67&&u.inGap67){u.inGap67=false;sequence67(g,['Squeeze_Exit']);}
  if(!moving&&!u.sleeping&&!u.seated41){u.idleClock67+=dt;
   const hearth=phase==='house'&&hs?.placed.find(e=>e.p.id==='fireplace65'&&e.m.userData.fireTime65>0&&Math.hypot(g.position.x-e.p.x,g.position.z-e.p.z)<1.6);
   if(hearth){g.rotation.y=Math.atan2(hearth.p.x-g.position.x,hearth.p.z-g.position.z);base='Warm_Hands_Loop';}
   else if(u.idleClock67>6&&!u.job67){const choices=u.cover67?['Peek_Left','Peek_Right']:['Idle_Sniff','Idle_Scratch_Ear','Idle_Rub_Nose','Idle_Look_Around'];sequence67(g,[choices[u.idleIndex67++%choices.length]]);}
  }else u.idleClock67=0;
 }
 if(u.rope66)base='Rope_Climb_Loop';else if(u.swim66)base=speed>.035?'Swim_Forward_Loop':'Swim_Tread_Loop';
 else if(u.climb&&u.climb.to.y>=u.climb.from.y)base='Ledge_Pull_Up';
 else if(u.wallState&&u.wallState.clock<.5&&g.position.y>u.wallState.o.h-.45)base='Ledge_Grab';
 else if(u.wallState&&!u.wallState.moving&&g.position.y>u.wallState.o.h-.45)base='Ledge_Hang_Loop';
 else if(act?.type==='roll')base='Forward_Roll';
 else if(u.heavy67&&!u.pick&&!u.air&&!u.wallState&&!act)base=speed>.07?'Carry_Heavy_Walk_Loop':'Carry_Idle_Loop';
 else if(u.pick)base=!u.pick.rare67||u.pick.t<1.5?'Carry_Pickup':u.pick.t<3.1?'Inspect_Find':'Pocket_Find';
 else if(!u.air&&!u.wallState&&!act){if(u.gap67&&moving)base='Squeeze_Shuffle_Loop';else if(u.cover67)base=moving?'Sneak_Walk_Loop':'Hide_Idle_Loop';}
 if(u.job67){const job=u.job67;let name=job.clips[job.index];job.time+=dt;
  if(job.hit&&job.time>=.43&&!job.hitDone){job.hitDone=true;tailHit67(g);}
  if(job.time>=(job.duration||u.pipActions[name].getClip().duration)){job.time=0;job.index++;if(job.index===job.clips.length){u.job67=null;if(job.done)job.done();}else name=job.clips[job.index];}
  if(u.job67)base=name;
 }
 if(u.tail67)u.tail67.setEffectiveWeight(['Idle','Walk','Run','Sprint','Jog','Push','Jump','Door'].includes(base)?1:0);
 return base;
}
function props67(g){const u=g.userData;
 // Item follows the real paws rather than the hidden legacy rig.
 if(u.pick){g.updateWorldMatrix(true,true);const l=u.pipBones.LeftHand?.getWorldPosition(new THREE.Vector3()),r=u.pipBones.RightHand?.getWorldPosition(new THREE.Vector3());if(l&&r){const p=l.add(r).multiplyScalar(.5);u.pick.item.parent.worldToLocal(p);u.pick.item.position.copy(p);}}
 if(u.heavy67&&!u.bundle67){u.bundle67=box(.65,.45,.45,cloth);g.add(u.bundle67);}if(u.bundle67){u.bundle67.visible=['Carry_Heavy_Walk_Loop','Carry_Idle_Loop','Carry_Put_Down'].includes(u.pipClip);if(u.bundle67.visible){g.updateWorldMatrix(true,true);const p=u.pipBones.LeftHand.getWorldPosition(new THREE.Vector3()).add(u.pipBones.RightHand.getWorldPosition(new THREE.Vector3())).multiplyScalar(.5);u.bundle67.position.copy(g.worldToLocal(p));}}
 const kind=u.pipClip==='Craft_Hammer_Loop'?'hammer':u.pipClip==='Craft_Saw_Loop'?'saw':u.pipClip==='Cook_Stir_Loop'?'spoon':null;
 if(kind&&u.toolProp67&&u.toolKind67!==kind){u.toolProp67.parent.remove(u.toolProp67);u.toolProp67.traverse(m=>{if(m.geometry)m.geometry.dispose();});u.toolProp67=null;}if(kind&&!u.toolProp67){const tool=new THREE.Group();tool.add(box(.045,.34,.045,wood));const head=kind==='hammer'?box(.18,.075,.07,tin):kind==='saw'?box(.24,.12,.025,tin):new THREE.Mesh(new THREE.SphereGeometry(.06,8,6),wood);head.position.y=.15;tool.add(head);g.add(tool);u.toolProp67=tool;u.toolKind67=kind;}
 if(u.toolProp67){u.toolProp67.visible=!!kind;if(kind){g.updateWorldMatrix(true,true);const hand=u.pipBones.RightHand;u.toolProp67.position.copy(g.worldToLocal(hand.getWorldPosition(new THREE.Vector3())));u.toolProp67.quaternion.copy(g.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(hand.getWorldQuaternion(new THREE.Quaternion())));}}
 if(g===rat){const b=$('tail67');b.style.display=['scavenge','explore','house','inside'].includes(phase)&&!photo.active?'block':'none';b.disabled=!!(u.rope66||u.swim66||u.air||u.pick||u.wallState||u.interaction);}
}
function whip67(){if(!gameplayActive()||!rat)return;const u=rat.userData;if(u.job67?.hit){u.comboQueued67=true;return;}if(u.job67?.lock||u.air||u.rope66||u.swim66||u.wallState||u.climb||u.pick||u.act||u.interaction)return;
 const stage=u.comboStage67||0,clip=['Tail_Whip_Attack','Tail_Combo_Reverse','Tail_Combo_Spin_Finisher'][stage];
 sequence67(rat,[clip],{lock:true,hit:true,done:()=>{if(u.comboQueued67&&stage<2){u.comboQueued67=false;u.comboStage67=stage+1;whip67();}else{u.comboStage67=0;u.comboQueued67=false;}}});
}
function tailHit67(g){if(voiceOn){const ac=sfxCtx();if(ac)tone(ac,{f:220,f2:65,dur:.12,vol:.045,type:'triangle'});}
 const w=world60;if(w?.owner!==root)return;for(const n of w.finds||[]){if(n.opened||!n.cover||!['board','box'].includes(n.type))continue;if(n.cover.getWorldPosition(new THREE.Vector3()).distanceTo(g.position)<1){n.opened=true;n.cover.visible=false;n.g.visible=true;sfx.step('wood');sayToast('Loose cover knocked away');}}
 if(sc?.cat?.m&&sc.cat.m.position.distanceTo(g.position)<1)sc.cat.state='leave';
}
const craft67=performCraft;performCraft=function(id,count=1){const c=CRAFT[id];if(!c||rat?.userData.job67?.lock)return false;const station=phase==='house'&&hs?.placed.find(e=>(e.p.id===(c.station||'workbench')||(c.station==='cookstove'&&e.p.id==='oven65'))&&Math.hypot(rat.position.x-e.p.x,rat.position.z-e.p.z)<=2.8);
 if((c.bench||c.station)&&(!station||Math.hypot(rat.position.x-station.p.x,rat.position.z-station.p.z)>2.8)){sayToast('Stand beside your '+(c.station?'cooking station':'crafting table')+' to make this.');return false;}
 if(!craft67(id,count))return false;if(station)rat.rotation.y=Math.atan2(station.p.x-rat.position.x,station.p.z-rat.position.z);
 sequence67(rat,[c.station?'Cook_Stir_Loop':station?(c.needs.stick?'Craft_Saw_Loop':'Craft_Hammer_Loop'):'Inspect_Find'],{duration:2.2,lock:true});return true;};
const land67=land57;land57=function(u,impact,surface){land67(u,impact,surface);if(impact>12&&!u.spring57&&!u.swim66&&!u.pick&&!u.job67){const back=(u.motionX||0)*Math.sin(rat.rotation.y)+(u.motionZ||0)*Math.cos(rat.rotation.y)<-.2;sequence67(rat,back?['Fall_Backward','Get_Up_Back']:['Fall_Forward','Get_Up_Front'],{lock:true});}};
const tailButton67=document.createElement('button');tailButton67.id='tail67';tailButton67.textContent='Tail whip';tailButton67.title='Tail whip (R) · tap again to chain';tailButton67.style.display='none';tailButton67.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();whip67();});document.body.appendChild(tailButton67);
addEventListener('keydown',e=>{if(e.repeat||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName))return;if(e.key.toLowerCase()==='r')whip67();});

const soundEffect67=effect58;effect58=function(kind,pos){soundEffect67(kind,pos);if(kind==='dog'&&rat&&pos&&rat.position.distanceTo(pos)<3&&!rat.userData.alertCD67&&!input67()&&!rat.userData.air&&!rat.userData.rope66&&!rat.userData.swim66&&!rat.userData.pick){rat.userData.alertCD67=25;sequence67(rat,['Danger_Freeze','Danger_Lower','Tail_Alert_Flick']);}};


// Undo only our own additive changes, preserving AnimationMixer's cached output.
function restorePose69(u){if(u.poseExtras69){for(const [name,q]of u.poseExtras69)u.pipBones[name].quaternion.copy(q);u.poseExtras69.clear();}}
function rotateBone69(u,name,x){const b=u.pipBones[name];if(!b)return;u.poseExtras69=u.poseExtras69||new Map();if(!u.poseExtras69.has(name))u.poseExtras69.set(name,b.quaternion.clone());b.rotateX(x);}
const recordings69=[{"name": "Councillor Crumb", "text": "I promise every bird a bigger nest, and a shorter winter.", "offset": 0, "duration": 3.91333}, {"name": "Opposition pigeon", "text": "You promised that last spring. We got a parking meter.", "offset": 4.21333, "duration": 3.318}, {"name": "The independent", "text": "I vote for whoever opens the dumpster.", "offset": 7.83133, "duration": 2.20667}, {"name": "Councillor Crumb", "text": "The council has approved a tax on shiny things.", "offset": 10.338, "duration": 3.65733}, {"name": "Opposition pigeon", "text": "Typical. The crows already own everything.", "offset": 14.29533, "duration": 2.774}, {"name": "The independent", "text": "Can we debate the actual issue? Someone ate my bread.", "offset": 17.36933, "duration": 3.42729}, {"name": "Zaytona", "text": "Meow? Oh, honestly.", "offset": 21.09662, "duration": 1.802}, {"name": "The Fat Rat", "text": "Hey, kid.", "offset": 23.19862, "duration": 1.15533}, {"name": "The Fat Rat", "text": "Welcome to the Bronx dumpster, kid. Find what you need and bounce.", "offset": 24.65396, "duration": 4.52067}, {"name": "The Fat Rat", "text": "Whole block got flooded. Everybody's stuff ends up here eventually.", "offset": 29.47462, "duration": 4.56533}, {"name": "The Fat Rat", "text": "Don't stay too long. The cats show up after dark, and they'll pull your guts out.", "offset": 34.33996, "duration": 5.30733}, {"name": "The Fat Rat", "text": "Go on. And take the sponge, it's the only thing in there that's dry.", "offset": 39.94729, "duration": 4.62}];
const speech69={buffer:null,loading:null,current:null,token:0};
function voiceBuffer69(){const ac=audio();if(!ac)return Promise.reject(Error('Audio unavailable'));if(speech69.buffer)return Promise.resolve(speech69.buffer);if(!speech69.loading)speech69.loading=fetch('assets/audio/voices69.mp3').then(r=>{if(!r.ok)throw Error('Voice download unavailable');return r.arrayBuffer();}).then(b=>ac.decodeAudioData(b)).then(b=>speech69.buffer=b).catch(e=>{speech69.loading=null;throw e;});return speech69.loading;}
function stopVoice69(){speech69.token++;if(speech69.current){const c=speech69.current;speech69.current=null;try{c.source.stop();}catch(e){}c.source.disconnect();c.gain.disconnect();}if(sound66.utterance?.recorded69)sound66.utterance=null;}
function playVoice69(cue,pos=null,onend=null){if(!voiceOn||!cue)return false;stopVoice69();const token=speech69.token;voiceBuffer69().then(buffer=>{if(token!==speech69.token||!voiceOn||document.hidden||(pos&&(!gameplayActive()||pos.distanceTo(rat.position)>8)))return;const ac=audio(),source=ac.createBufferSource(),gain=ac.createGain();source.buffer=buffer;gain.gain.value=pos?Math.max(.15,Math.min(.9,1-pos.distanceTo(rat.position)/10)):.9;source.connect(gain).connect(ac.destination);const current={source,gain,pos};speech69.current=current;source.onended=()=>{if(speech69.current!==current)return;speech69.current=null;source.disconnect();gain.disconnect();if(sound66.utterance?.recorded69)sound66.utterance=null;if(onend)onend();};if(pos)sound66.voiceClock=cue.duration+1;source.start(0,cue.offset,cue.duration);}).catch(()=>{if(token===speech69.token&&sound66.utterance?.recorded69)sound66.utterance=null;});return true;}
function ambientVoice69(name,line,pos){if(!voiceOn||!gameplayActive()||sound66.utterance||sound66.voiceClock>1||pos.distanceTo(rat.position)>8)return false;
 const cue=recordings69.find(c=>c.name===name&&c.text.replace(/[^a-z]/gi,'').toLowerCase()===line.replace(/[^a-z]/gi,'').toLowerCase())||recordings69.find(c=>c.name===name);
 const el=$('chatter66');el.textContent=name+': '+line;el.style.display='block';sound66.voicePos=pos;sound66.voiceClock=(cue?.duration||5)+2;playVoice69(cue,pos);sound66.utterance={recorded69:true};return true;}
function lineVoice69(text,onend){return playVoice69(recordings69.find(c=>c.text===text),null,onend);}
const music69={index:0,el:null,pending:false,blocked:false,unlocked:false,volume:.35,tracks:[
 {title:'Bach · Goldberg Aria',file:'assets/audio/bach69-0.mp3'},
 {title:'Bach · Variation 1',file:'assets/audio/bach69-1.mp3'},
 {title:'Bach · Variation 5',file:'assets/audio/bach69-2.mp3'}
]};
function musicElement69(){if(!music69.el){const el=music69.el=new Audio();el.preload='none';el.addEventListener('ended',()=>{music69.index=(music69.index+1)%music69.tracks.length;setTrack69();musicTick69();});el.addEventListener('error',()=>{music69.blocked=true;music69.pending=false;$('pianoToggle').textContent='Music · tap to retry';});}return music69.el;}
function setTrack69(){const el=musicElement69();el.pause();el.src=music69.tracks[music69.index].file;music69.blocked=false;$('pianoToggle').textContent=music69.tracks[music69.index].title;}
function musicTick69(){if(typeof music69==='undefined'||!music69.unlocked)return;const allowed=piano.enabled&&voiceOn&&!document.hidden&&!radio.on&&['scavenge','explore','house','inside'].includes(phase);if(!allowed){music69.el?.pause();return;}const el=musicElement69();if(!el.getAttribute?.('src')&&!el.src)setTrack69();el.volume=music69.volume*((speech69.current||sc?.talk)?.3:1);if(el.paused&&!music69.pending&&!music69.blocked){music69.pending=true;el.play().then(()=>{music69.pending=false;}).catch(()=>{music69.pending=false;music69.blocked=true;$('pianoToggle').textContent='Music · tap to play';});}}
function chooseMusic69(i){radioStop();music69.index=i;piano.enabled=true;music69.unlocked=true;music69.blocked=false;setTrack69();musicTick69();musicMenu69();}
function musicMenu69(){modal('Music',`<p>${piano.enabled?'Playing':'Paused'} · ${music69.tracks[music69.index].title}</p><p>Recorded piano performances by Kimiko Ishizaka. Public domain (CC0).</p>`,[
 [piano.enabled?'Pause':'Play',()=>{music69.unlocked=true;music69.blocked=false;piano.enabled=!piano.enabled;musicTick69();musicMenu69();}],
 ...music69.tracks.map((c,i)=>[c.title,()=>chooseMusic69(i)]),
 ['Next track',()=>chooseMusic69((music69.index+1)%music69.tracks.length)],
 ['Volume · '+Math.round(music69.volume*100)+'%',()=>{music69.volume=music69.volume>.5?.2:music69.volume>.25?.6:.35;musicTick69();musicMenu69();}],
 ['Music credits',()=>modal('Music credits','<p>J.S. Bach · Goldberg Variations: Aria, Variation 1 and Variation 5.</p><p>Performed by Kimiko Ishizaka. Open Goldberg Variations, 2012. CC0 public-domain dedication. Normalized and encoded as MP3 for this game.</p><p><a href="https://opengoldbergvariations.org/" target="_blank" rel="noopener">Recording project and license</a></p><p>Character dialogue is synthetic audio generated with the open Kokoro model, rather than the phone’s speech engine.</p>',[['Back',musicMenu69]])],['Close',closeModal]
 ]);}
$('pianoToggle').onclick=musicMenu69;
const unlock69=()=>{music69.unlocked=true;music69.blocked=false;musicTick69();if(voiceOn)voiceBuffer69().catch(()=>{});};
for(const id of ['start','newgame'])$(id).addEventListener('click',unlock69);
$('mute').addEventListener('click',()=>{if(!voiceOn)stopVoice69();musicTick69();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice69();musicTick69();});

CRAFT.vinyl60.name='Goldberg Aria · gold label';CRAFT.vinyl61.name='Goldberg Variation 1 · blue label';CRAFT.vinyl62.name='Goldberg Variation 5 · rose label';

piano.timer=setInterval(schedulePiano,250);
// Bilgin Beta: abandoned inflatable paddling pool.
let bilginPool=null;
function buildBilginPool(){
 const g=new THREE.Group();g.name='Old patched inflatable kids pool';g.position.set(-15,0,33);root.add(g);
 const vinyl=[0x889da0,0xd0b979,0xa78c89].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.83}));
 for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(3,.19,10,64),vinyl[i]);m.rotation.x=-Math.PI/2;m.position.y=.2+i*.28;m.name='Inflatable vinyl rim';m.castShadow=true;m.receiveShadow=true;g.add(m);}
 const floor=new THREE.Mesh(new THREE.CircleGeometry(3,64),new THREE.MeshStandardMaterial({color:0x596c54,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=.035;floor.name='Pool liner';g.add(floor);
 // A few seams and mismatched repair patches make it look used, without extra textures.
 for(let i=0;i<10;i++){const a=i*2.399;const patch=new THREE.Mesh(new THREE.BoxGeometry(.29,.16,.035),new THREE.MeshStandardMaterial({color:i%2?0x696456:0xb5aa80,roughness:1}));patch.position.set(Math.sin(a)*3.18,.22+(i%3)*.28,Math.cos(a)*3.18);patch.rotation.y=a;patch.rotation.z=.12*Math.sin(i);g.add(patch);}
 registerSolid62(g);
 const water=new THREE.Mesh(new THREE.CircleGeometry(2.81,64),new THREE.MeshStandardMaterial({color:0x647f68,roughness:.22,metalness:.15,transparent:true,opacity:.79,depthWrite:false}));water.rotation.x=-Math.PI/2;water.position.set(-15,.59,33);water.name='Murky pool water';root.add(water);
 const ripples=[];for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.RingGeometry(.92,1,40),new THREE.MeshBasicMaterial({color:0xc8d6b5,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.visible=false;root.add(r);ripples.push({m:r,age:2});}
 bilginPool={owner:root,g,water,ripples,clock:0,wet:false,trail:0};
}
const oldStartBilgin=startScavenge;startScavenge=function(){oldStartBilgin();buildBilginPool();};
const oldVolumeBilgin=waterVolume66;waterVolume66=function(p){const b=bilginPool;if(b&&b.owner===root&&Math.hypot(p.x+15,p.z-33)<2.81)return b.water;return oldVolumeBilgin(p);};
const oldWaterBilgin=waterTick65;waterTick65=function(dt){oldWaterBilgin(dt);const b=bilginPool;if(!b||b.owner!==root||!rat)return;b.clock+=dt;b.water.position.y=.59+Math.sin(b.clock*1.8)*.008;const p=rat.position,inside=Math.hypot(p.x+15,p.z-33)<2.75&&p.y<b.water.position.y;const entered=inside&&!b.wet;b.trail-=dt;if(inside&&(entered||(rat.userData.vel>.08&&b.trail<=0))){b.trail=.45;const r=b.ripples.reduce((a,c)=>a.age>c.age?a:c);r.age=0;r.m.position.set(p.x,b.water.position.y+.012,p.z);r.m.visible=true;if(entered&&voiceOn)sfx.step('water');}b.wet=inside;for(const r of b.ripples){r.age+=dt;r.m.visible=r.age<1.3;if(r.m.visible){r.m.scale.setScalar(.07+r.age*.55);r.m.material.opacity=(1-r.age/1.3)*.42;r.m.position.y=b.water.position.y+.012;}}};

// Reject distant scenery before invoking detailed triangle collision tests.
const accelerateBeforeBeta=accelerate64;
accelerate64=function(mesh){accelerateBeforeBeta(mesh);if(mesh.userData.boundsBeta||mesh.isSkinnedMesh)return;mesh.userData.boundsBeta=true;const precise=mesh.raycast,worldBox=new THREE.Box3(),matrix=new THREE.Matrix4(),point=new THREE.Vector3();let geom=null,ready=false;
 mesh.raycast=function(raycaster,hits){if(!this.geometry||this.isSkinnedMesh)return precise.call(this,raycaster,hits);if(!ready||geom!==this.geometry||!matrix.equals(this.matrixWorld)){geom=this.geometry;if(!geom.boundingBox)geom.computeBoundingBox();worldBox.copy(geom.boundingBox).applyMatrix4(this.matrixWorld);matrix.copy(this.matrixWorld);ready=true;}if(!worldBox.containsPoint(raycaster.ray.origin)){if(!raycaster.ray.intersectBox(worldBox,point))return;if(point.distanceToSquared(raycaster.ray.origin)>raycaster.far*raycaster.far)return;}precise.call(this,raycaster,hits);};};

// All declarations and extension state are ready before constructing the title.
startTitle();
requestAnimationFrame(loop);
