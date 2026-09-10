import bpy,math,random,numpy as np,json
from mathutils import Vector
from pathlib import Path
P=Path(__file__).resolve().parents[2]/'generated'/'junkyard-build31';P.mkdir(parents=True,exist_ok=True);random.seed(22);bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def V(x,y,z):return (x,-z,y)
def mat(n,col,texture=None,emit=0):
 m=bpy.data.materials.new(n);m.diffuse_color=(*col,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*col,1);p.inputs['Roughness'].default_value=.88
 if emit:p.inputs['Emission Color'].default_value=(*col,1);p.inputs['Emission Strength'].default_value=emit
 if texture:
  rng=np.random.default_rng(4);a=rng.random((128,128));yy,xx=np.mgrid[:128,:128];v=.7+.25*a+.10*np.sin(xx*.8+np.sin(yy*.06)) if texture=='wood' else .64+.22*np.sin(xx*.065+np.sin(yy*.054)*2)+.1*a
  data=np.ones((128,128,4),dtype=np.float32);data[:,:,:3]=v[:,:,None]*np.array(col)[None,None,:];im=bpy.data.images.new(n+' painted texture',128,128);im.pixels.foreach_set(data.ravel());im.pack();tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=im;m.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
 return m
wood=mat('Weathered timber',(.44,.30,.15),'wood');teal=mat('Peeling teal fence',(.22,.39,.35),'wood');soil=mat('Mottled yard dirt',(.40,.43,.34),'soil');stone=mat('Worn paving',(.52,.53,.43),'soil');blue=mat('Blue galvanized steel',(.27,.43,.49),'wood');rust=mat('Rusty drums',(.40,.19,.085),'soil');rubber=mat('Old rubber',(.035,.044,.038));roof=mat('Slate blue roofing',(.15,.25,.29),'wood');glass=mat('Warm window glass',(.95,.54,.15),emit=.7);dark=mat('Dark iron',(.065,.075,.06));brick=mat('Broken brick',(.39,.20,.10),'soil')
objects=[];obstacles=[];platforms=[]
def box(n,x,y,z,w,h,d,m,bev=0):
 me=bpy.data.meshes.new(n);me.from_pydata([(-.5,-.5,-.5),(.5,-.5,-.5),(.5,.5,-.5),(-.5,.5,-.5),(-.5,-.5,.5),(.5,-.5,.5),(.5,.5,.5),(-.5,.5,.5)],[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);me.update();uv=me.uv_layers.new(name='UVMap')
 for face in me.polygons:
  for li,co in zip(face.loop_indices,[(0,0),(1,0),(1,1),(0,1)]):uv.data[li].uv=co
 o=bpy.data.objects.new(n,me);bpy.context.collection.objects.link(o);o.location=V(x,y,z);o.scale=(w,d,h);o.data.materials.append(m)
 if bev:mod=o.modifiers.new('Worn edges','BEVEL');mod.width=bev;mod.segments=1;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
 objects.append(o);return o
def cyl(n,x,y,z,r,h,m):
 bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=r,depth=h,location=V(x,y,z));o=bpy.context.object;o.name=n;o.data.materials.append(m);objects.append(o);return o
def crate(x,z,size=1.8,y=0):
 box('Crate core',x,y+size/2,z,size,size,size,wood)
 for j in range(5):
  u=(j-2)*size/5;box('Crate boards',x+u,y+size/2,z+size/2+.02,size*.18,size,.055,wood)
 for dy in [.13,size-.13]:box('Crate straps',x,y+dy,z+size/2+.06,size+.07,.16,.11,wood)
 if y==0:obstacles.append(dict(x=x,z=z,hx=size/2,hz=size/2,h=size))
def tire(x,z,y=0):
 bpy.ops.mesh.primitive_torus_add(major_segments=20,minor_segments=8,location=V(x,y+.22,z),major_radius=.57,minor_radius=.23);o=bpy.context.object;o.name='Discarded tyre';o.data.materials.append(rubber);objects.append(o)
def barrel(x,z,m=blue):
 cyl('Steel barrel',x,.85,z,.65,1.7,m)
 for y in [.12,.53,1.2,1.61]:cyl('Rolled barrel rim',x,y,z,.68,.07,m)
 cyl('Barrel lid',x,1.71,z,.61,.03,m);cyl('Bung',x+.22,1.75,z,.065,.035,dark);obstacles.append(dict(x=x,z=z,hx=.65,hz=.65,h=1.75))
def deck(x,z,w=6,d=4,h=1.35):
 for j in range(round(w/.28)):box('Deck plank',x-w/2+(j+.5)*w/round(w/.28),h-.10,z,w/round(w/.28)-.022,.2,d,wood)
 for a in [-1,1]:
  for b in [-1,1]:box('Platform leg',x+a*(w/2-.25),h/2,z+b*(d/2-.25),.23,h,.23,wood)
 platforms.append(dict(x=x,z=z,hx=w/2,hz=d/2,h=h))
 for i in range(3):
  ht=h*(i+1)/4;sz=z+d/2+1.8-i*.6;box('Wooden access step',x,ht/2,sz,2.2,ht,.6,wood);platforms.append(dict(x=x,z=sz,hx=1.1,hz=.3,h=ht))
box('Foundation',5,-.2,6,54,.4,42,soil)
# Continuous upright boards with two weathered rails; front entrance and right exit.
for side in ['back','front','left','right']:
 length=54 if side in ['back','front'] else 42
 for i in range(round(length/.44)):
  t=-length/2+(i+.5)*length/round(length/.44)
  x,z=(5+t,-15 if side=='back' else 27) if side in ['back','front'] else (-22 if side=='left' else 32,6+t)
  if side=='front' and abs(x-1)<2.6 or side=='right' and abs(z-19)<2.3:continue
  ht=3.1+random.uniform(-.18,.18);o=box('Fence paling',x,ht/2,z,.40,ht,.12,teal)
  if side in ['left','right']:o.rotation_euler.z=math.pi/2
 for y in [.75,2.3]:
  # Split rails around gates, too.
  spans=[(-27,27)] if side=='back' else ([(-27,-6.6),(-1.4,27)] if side=='front' else ([(-21,10.7),(15.3,21)] if side=='right' else [(-21,21)]))
  for a,b in spans:
   if side in ['back','front']:box('Fence rail',5+(a+b)/2,y,-14.85 if side=='back' else 26.85,b-a,.15,.16,wood)
   else:box('Fence rail',-21.85 if side=='left' else 31.85,y,6+(a+b)/2,.16,.15,b-a,wood)
# Shed at rear right, front door faces the open centre.
box('Shed',22,2.45,-6,11,4.9,9,wood);obstacles.append(dict(x=22,z=-6,hx=5.5,hz=4.5,h=8))
for x in [16.5+i*.42 for i in range(27)]:box('Shed siding',x,2.45,-1.46,.36,4.9,.065,wood)
box('Shed door',22,1.7,-1.38,2.5,3.4,.12,rust);cyl('Porch light',22,3.85,-1.1,.25,.28,glass)
for x in [18.6,25.4]:
 box('Window frame',x,2.5,-1.30,1.95,1.75,.15,wood);box('Window glow',x,2.5,-1.20,1.6,1.4,.04,glass)
 box('Window mullion',x,2.5,-1.14,.10,1.5,.09,wood);box('Window crossbar',x,2.5,-1.14,1.7,.10,.09,wood)
# Pitched roof uses two sloping quads, plus visible gable ends.
verts=[V(15.9,4.9,-11),V(28.1,4.9,-11),V(28.1,6.75,-6),V(15.9,6.75,-6),V(15.9,4.9,-1),V(28.1,4.9,-1)]
me=bpy.data.meshes.new('Roof');me.from_pydata(verts,[],[(0,1,2,3),(3,2,5,4)]);o=bpy.data.objects.new('Pitched roof',me);bpy.context.collection.objects.link(o);o.data.materials.append(roof);objects.append(o)
for x in [15.9,28.1]:
 me=bpy.data.meshes.new('Gable');me.from_pydata([V(x,4.9,-11),V(x,6.75,-6),V(x,4.9,-1)],[],[(0,1,2)]);o=bpy.data.objects.new('Shed gable',me);bpy.context.collection.objects.link(o);o.data.materials.append(wood);objects.append(o)
# Platforms and grouped salvage follow the reference's left/rear and front piles.
deck(-11,-9,9,4,1.6);deck(-12,2,6,4);deck(7,13,6,4)
for x,z in [(-16,-11),(-12,-11),(-18,7),(26,22),(-17,21),(10,-11)]:
 crate(x,z);crate(x+.18,z,1.5,1.8);crate(x+2,z+.8,1.4)
for x,z in [(-19,-11),(-17,-12),(7,-12),(10,-12),(-19,21),(28,23),(25,23)]:
 tire(x,z);tire(x,z,.45);tire(x+.8,z+.3)
for x,z,m in [(-18,10,blue),(-16,18,rust),(11,-10,rust),(13,-9,blue),(12,14,blue),(27,20,rust),(-8,7,blue),(-18,-5,blue),(28,1,blue)]:barrel(x,z,m)
# Small enclosed scrap bay beside the shed.
for x,z,w,d in [(28,8,5,.12),(25.5,10,.12,4),(30.5,10,.12,4)]:box('Scrap bay',x,1.0,z,w,2,d,teal);obstacles.append(dict(x=x,z=z,hx=w/2,hz=d/2,h=2))
for i in range(80):
 x,z=random.choice([(-18,1),(-17,17),(26,22),(-8,-12)]);x+=random.uniform(-2,2);z+=random.uniform(-2,2)
 if i%3:o=box('Broken timber',x,.09,z,random.uniform(.7,2),.12,.16,wood)
 else:o=box('Brick fragment',x,.15,z,.65,.3,.35,brick)
 o.rotation_euler.z=random.random()*math.tau
for i in range(210):
 x=random.uniform(-20,30);z=random.uniform(-13,25)
 if 16<x<28 and -11<z<0:continue
 o=box('Scattered paving',x,.016,z,random.uniform(.35,.8),.032,random.uniform(.3,.7),stone);o.rotation_euler.z=random.uniform(-.5,.5)
# Merge by material: small mobile draw-call count, shared static map geometry.
for m in list(bpy.data.materials):
 group=[o for o in list(bpy.data.objects) if o.type=='MESH' and len(o.data.materials) and o.data.materials[0]==m]
 if not group:continue
 bpy.ops.object.select_all(action='DESELECT')
 for o in group:o.select_set(True)
 bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();group[0].name=m.name
bpy.ops.object.select_all(action='SELECT');bpy.ops.export_scene.gltf(filepath=str(P/'junkyard.glb'),export_format='GLB',export_yup=True,export_animations=False)
(P/'map-collision.json').write_text(json.dumps(dict(obstacles=obstacles,platforms=platforms)))
# Actual asset render, with a clear isometric view of the gate and shed.
world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.075,.12,.13,1);world.node_tree.nodes['Background'].inputs[1].default_value=.7
bpy.ops.object.light_add(type='AREA',location=(0,-5,45));bpy.context.object.data.energy=16000;bpy.context.object.data.size=35
bpy.ops.object.camera_add(location=V(65,60,78));cam=bpy.context.object;cam.rotation_euler=(Vector(V(5,0,6))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=76
sc=bpy.context.scene;sc.camera=cam;sc.render.engine='CYCLES';sc.cycles.samples=12;sc.cycles.use_denoising=True;sc.render.resolution_x=1200;sc.render.resolution_y=900;sc.render.resolution_percentage=100;sc.render.filepath=str(P/'Junkyard-preview.png');bpy.ops.wm.save_as_mainfile(filepath=str(P/'Junkyard.blend'));bpy.ops.render.render(write_still=True)
