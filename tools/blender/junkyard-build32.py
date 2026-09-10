import bpy, math, random, numpy as np, json
from mathutils import Vector
from pathlib import Path
P = Path(__file__).resolve().parents[2] / 'generated' / 'junkyard-build32'
P.mkdir(parents=True, exist_ok=True)
random.seed(22)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def V(x, y, z):
    return (x, -z, y)

def mat(n, col, texture=None, emit=0):
    m = bpy.data.materials.new(n)
    m.diffuse_color = (*col, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*col, 1)
    p.inputs['Roughness'].default_value = 0.88
    if emit:
        p.inputs['Emission Color'].default_value = (*col, 1)
        p.inputs['Emission Strength'].default_value = emit
    if texture:
        rng = np.random.default_rng(4)
        a = rng.random((128, 128))
        yy, xx = np.mgrid[:128, :128]
        v = 0.86 + 0.035 * a + 0.07 * np.sin(xx * 0.3 + np.sin(yy * 0.06)) if texture == 'wood' else 0.82 + 0.12 * np.sin(xx * 0.065 + np.sin(yy * 0.054) * 2) + 0.025 * a
        data = np.ones((128, 128, 4), dtype=np.float32)
        data[:, :, :3] = v[:, :, None] * np.array(col)[None, None, :]
        im = bpy.data.images.new(n + ' painted texture', 128, 128)
        im.pixels.foreach_set(data.ravel())
        im.pack()
        tex = m.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = im
        m.node_tree.links.new(tex.outputs['Color'], p.inputs['Base Color'])
    return m
wood = mat('Weathered timber', (0.6, 0.39, 0.18), 'wood')
teal = mat('Peeling teal fence', (0.22, 0.52, 0.43), 'wood')
soil = mat('Mottled yard dirt', (0.48, 0.48, 0.31), 'soil')
stone = mat('Worn paving', (0.52, 0.53, 0.43), 'soil')
blue = mat('Blue galvanized steel', (0.25, 0.49, 0.62), 'wood')
rust = mat('Rusty drums', (0.61, 0.26, 0.1), 'soil')
rubber = mat('Old rubber', (0.035, 0.044, 0.038))
roof = mat('Slate blue roofing', (0.15, 0.25, 0.29), 'wood')
glass = mat('Warm window glass', (0.95, 0.54, 0.15), emit=0.7)
dark = mat('Dark iron', (0.065, 0.075, 0.06))
brick = mat('Broken brick', (0.39, 0.2, 0.1), 'soil')
objects = []
obstacles = []
platforms = []

def box(n, x, y, z, w, h, d, m, bev=0):
    me = bpy.data.meshes.new(n)
    me.from_pydata([(-0.5, -0.5, -0.5), (0.5, -0.5, -0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5), (-0.5, -0.5, 0.5), (0.5, -0.5, 0.5), (0.5, 0.5, 0.5), (-0.5, 0.5, 0.5)], [], [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)])
    me.update()
    uv = me.uv_layers.new(name='UVMap')
    for face in me.polygons:
        for li, co in zip(face.loop_indices, [(0, 0), (1, 0), (1, 1), (0, 1)]):
            uv.data[li].uv = co
    o = bpy.data.objects.new(n, me)
    bpy.context.collection.objects.link(o)
    o.location = V(x, y, z)
    o.scale = (w, d, h)
    o.data.materials.append(m)
    if bev:
        mod = o.modifiers.new('Worn edges', 'BEVEL')
        mod.width = bev
        mod.segments = 1
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier=mod.name)
    objects.append(o)
    return o

def cyl(n, x, y, z, r, h, m):
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=r, depth=h, location=V(x, y, z))
    o = bpy.context.object
    o.name = n
    o.data.materials.append(m)
    objects.append(o)
    return o

def crate(x, z, size=1.8, y=0):
    box('Crate core', x, y + size / 2, z, size, size, size, wood)
    for j in range(5):
        u = (j - 2) * size / 5
        box('Crate boards', x + u, y + size / 2, z + size / 2 + 0.02, size * 0.18, size, 0.055, wood)
    for dy in [0.13, size - 0.13]:
        box('Crate straps', x, y + dy, z + size / 2 + 0.06, size + 0.07, 0.16, 0.11, wood)
    if y == 0:
        obstacles.append(dict(x=x, z=z, hx=size / 2, hz=size / 2, h=size))

def tire(x, z, y=0):
    bpy.ops.mesh.primitive_torus_add(major_segments=20, minor_segments=8, location=V(x, y + 0.22, z), major_radius=0.57, minor_radius=0.23)
    o = bpy.context.object
    o.name = 'Discarded tyre'
    o.data.materials.append(rubber)
    objects.append(o)

def barrel(x, z, m=blue):
    cyl('Steel barrel', x, 0.85, z, 0.65, 1.7, m)
    for y in [0.12, 0.53, 1.2, 1.61]:
        cyl('Rolled barrel rim', x, y, z, 0.68, 0.07, m)
    cyl('Barrel lid', x, 1.71, z, 0.61, 0.03, m)
    cyl('Bung', x + 0.22, 1.75, z, 0.065, 0.035, dark)
    obstacles.append(dict(x=x, z=z, hx=0.65, hz=0.65, h=1.75))

def deck(x, z, w=6, d=4, h=1.35):
    for j in range(round(w / 0.28)):
        box('Deck plank', x - w / 2 + (j + 0.5) * w / round(w / 0.28), h - 0.1, z, w / round(w / 0.28) - 0.022, 0.2, d, wood)
    for a in [-1, 1]:
        for b in [-1, 1]:
            box('Platform leg', x + a * (w / 2 - 0.25), h / 2, z + b * (d / 2 - 0.25), 0.23, h, 0.23, wood)
    platforms.append(dict(x=x, z=z, hx=w / 2, hz=d / 2, h=h))
    for i in range(3):
        ht = h * (i + 1) / 4
        sz = z + d / 2 + 1.8 - i * 0.6
        box('Wooden access step', x, ht / 2, sz, 2.2, ht, 0.6, wood)
        platforms.append(dict(x=x, z=sz, hx=1.1, hz=0.3, h=ht))

# Continuous upright boards with two weathered rails; front entrance and right exit.
box('Foundation', 5, -0.2, 12, 54, 0.4, 54, soil)
for side in ['back', 'front', 'left', 'right']:
    length = 54 if side in ['back', 'front'] else 42
    for i in range(round(length / 0.44)):
        t = -length / 2 + (i + 0.5) * length / round(length / 0.44)
        x, z = (5 + t, -15 if side == 'back' else 27) if side in ['back', 'front'] else (-22 if side == 'left' else 32, 6 + t)
        if side == 'front' and abs(x - 1) < 2.6 or (side == 'right' and abs(z - 19) < 2.3):
            continue
        ht = 3.1 + random.uniform(-0.18, 0.18)
        o = box('Fence paling', x, ht / 2, z, 0.4, ht, 0.12, teal)
        if side in ['left', 'right']:
            o.rotation_euler.z = math.pi / 2
    for y in [0.75, 2.3]:
        # Split rails around gates, too.
        spans = [(-27, 27)] if side == 'back' else [(-27, -6.6), (-1.4, 27)] if side == 'front' else [(-21, 10.7), (15.3, 21)] if side == 'right' else [(-21, 21)]
        for a, b in spans:
            if side in ['back', 'front']:
                box('Fence rail', 5 + (a + b) / 2, y, -14.85 if side == 'back' else 26.85, b - a, 0.15, 0.16, wood)
            else:
                box('Fence rail', -21.85 if side == 'left' else 31.85, y, 6 + (a + b) / 2, 0.16, 0.15, b - a, wood)

# Shed at rear right, front door faces the open centre.
homeStart = len(objects)
box('Shed', 22, 2.45, -6, 11, 4.9, 9, wood)
obstacles.append(dict(x=22, z=-6, hx=5.5, hz=4.5, h=8))
for x in [16.5 + i * 0.42 for i in range(27)]:
    box('Shed siding', x, 2.45, -1.46, 0.36, 4.9, 0.065, wood)
box('Shed door', 22, 1.7, -1.38, 2.5, 3.4, 0.12, rust)
cyl('Porch light', 22, 3.85, -1.1, 0.25, 0.28, glass)
for x in [18.6, 25.4]:
    box('Window frame', x, 2.5, -1.3, 1.95, 1.75, 0.15, wood)
    box('Window glow', x, 2.5, -1.2, 1.6, 1.4, 0.04, glass)
    box('Window mullion', x, 2.5, -1.14, 0.1, 1.5, 0.09, wood)
    box('Window crossbar', x, 2.5, -1.14, 1.7, 0.1, 0.09, wood)

# Pitched roof uses two sloping quads, plus visible gable ends.
verts = [V(15.9, 4.9, -11), V(28.1, 4.9, -11), V(28.1, 6.75, -6), V(15.9, 6.75, -6), V(15.9, 4.9, -1), V(28.1, 4.9, -1)]
me = bpy.data.meshes.new('Roof')
me.from_pydata(verts, [], [(0, 1, 2, 3), (3, 2, 5, 4)])
o = bpy.data.objects.new('Pitched roof', me)
bpy.context.collection.objects.link(o)
o.data.materials.append(roof)
objects.append(o)
for x in [15.9, 28.1]:
    me = bpy.data.meshes.new('Gable')
    me.from_pydata([V(x, 4.9, -11), V(x, 6.75, -6), V(x, 4.9, -1)], [], [(0, 1, 2)])
    o = bpy.data.objects.new('Shed gable', me)
    bpy.context.collection.objects.link(o)
    o.data.materials.append(wood)
    objects.append(o)

# Rat-sized shelter outside the front fence, with a continuous path from the gate.
for o in objects[homeStart:]:
    o.location.x = 12 + (o.location.x - 22) * 0.24
    o.location.y = -33 + (o.location.y - 6) * 0.24
    o.location.z *= 0.24
    o.scale *= 0.24
obstacles[-1] = dict(x=12, z=33, hx=1.32, hz=1.08, h=2)

# Front fence collisions retain the visible gate opening.
obstacles.extend([dict(x=-11.8, z=27, hx=10.2, hz=0.1, h=3.5), dict(x=17.8, z=27, hx=14.2, hz=0.1, h=3.5)])
for i in range(18):
    box('Path to Pip home', 1 + i * 0.6, 0.025, 28 + i * 0.34, 0.65, 0.05, 0.7, stone)

# Platforms and grouped salvage follow the reference's left/rear and front piles.
deck(-11, -9, 9, 4, 1.6)
deck(-12, 2, 6, 4)
deck(7, 13, 6, 4)
for x, z in [(-16, -11), (-12, -11), (-18, 7), (26, 22), (-17, 21), (10, -11)]:
    crate(x, z)
    crate(x + 0.18, z, 1.5, 1.8)
    crate(x + 2, z + 0.8, 1.4)
for x, z in [(-19, -11), (-17, -12), (7, -12), (10, -12), (-19, 21), (28, 23), (25, 23)]:
    tire(x, z)
    tire(x, z, 0.45)
    tire(x + 0.8, z + 0.3)
for x, z, m in [(-18, 10, blue), (-16, 18, rust), (11, -10, rust), (13, -9, blue), (12, 14, blue), (27, 20, rust), (-8, 7, blue), (-18, -5, blue), (28, 1, blue)]:
    barrel(x, z, m)

# Small enclosed scrap bay beside the shed.
for x, z, w, d in [(28, 8, 5, 0.12), (25.5, 10, 0.12, 4), (30.5, 10, 0.12, 4)]:
    box('Scrap bay', x, 1.0, z, w, 2, d, teal)
    obstacles.append(dict(x=x, z=z, hx=w / 2, hz=d / 2, h=2))
for i in range(80):
    x, z = random.choice([(-18, 1), (-17, 17), (26, 22), (-8, -12)])
    x += random.uniform(-2, 2)
    z += random.uniform(-2, 2)
    if i % 3:
        o = box('Broken timber', x, 0.09, z, random.uniform(0.7, 2), 0.12, 0.16, wood)
    else:
        o = box('Brick fragment', x, 0.15, z, 0.65, 0.3, 0.35, brick)
    o.rotation_euler.z = random.random() * math.tau
for i in range(210):
    x = random.uniform(-20, 30)
    z = random.uniform(-13, 25)
    if 16 < x < 28 and -11 < z < 0:
        continue
    o = box('Scattered paving', x, 0.016, z, random.uniform(0.35, 0.8), 0.032, random.uniform(0.3, 0.7), stone)
    o.rotation_euler.z = random.uniform(-0.5, 0.5)

# Recognisable human-sized salvage, using 1 game unit = 0.5 metres.
cream = mat('Cream enamel', (0.76, 0.73, 0.56))
red = mat('Cartoon coral', (0.68, 0.22, 0.13))
green = mat('Bottle green', (0.13, 0.4, 0.25))
cable = mat('Cable ink', (0.055, 0.075, 0.075))

def solid(x, z, hx, hz, h):
    obstacles.append(dict(x=x, z=z, hx=hx, hz=hz, h=h))

def ring(n, x, y, z, r, t, m, vertical=False):
    bpy.ops.mesh.primitive_torus_add(major_segments=20, minor_segments=8, location=V(x, y, z), major_radius=r, minor_radius=t)
    o = bpy.context.object
    o.name = n
    o.data.materials.append(m)
    if vertical:
        o.rotation_euler.x = math.pi / 2
    objects.append(o)
    return o

# Fridge with a crooked upper door and metal handles.
box('Abandoned fridge', 23, 1.7, -7, 1.5, 3.4, 1.4, cream)
solid(23, -7, 0.75, 0.7, 3.4)
for yy, hh in [(2.75, 1.0), (1.15, 2.05)]:
    box('Fridge door', 23, yy, -6.26, 1.43, hh, 0.12, cream)
    box('Fridge handle', 23.5, yy, -6.14, 0.075, 0.4, 0.1, dark)

# Washing machine, circular front loader and control buttons.
box('Washing machine', 19, 0.85, -6, 1.7, 1.7, 1.4, blue)
solid(19, -6, 0.85, 0.7, 1.7)
ring('Washer rim', 19, 0.77, -5.26, 0.49, 0.08, cream, True)
o = cyl('Washer drum', 19, 0.77, -5.23, 0.42, 0.06, dark)
o.rotation_euler.x = math.pi / 2
for x in [18.55, 18.85, 19.4]:
    o = cyl('Washer dial', x, 1.45, -5.23, 0.07, 0.06, cream)
    o.rotation_euler.x = math.pi / 2

# Cable spool and coiled wire.
for y in [0.1, 1.35]:
    cyl('Cable spool disc', 20, y, 17, 1.15, 0.16, wood)
cyl('Cable spool core', 20, 0.72, 17, 0.45, 1.2, wood)
solid(20, 17, 1.15, 1.15, 1.45)
for y in [0.3 + i * 0.08 for i in range(11)]:
    ring('Wound cable', 20, y, 17, 0.63, 0.055, cable)

# Wheelbarrow, with an open bowl, handles and a front wheel.
box('Wheelbarrow tray', 14, 1.0, 4, 1.15, 0.12, 1.5, rust)
solid(14, 4, 0.75, 1.1, 1.4)
for x in [13.4, 14.6]:
    box('Tray side', x, 1.2, 4, 0.12, 0.4, 1.5, rust)
    box('Wheelbarrow handle', x, 0.9, 5, 0.09, 0.09, 1.8, wood)
box('Tray front', 14, 1.2, 3.25, 1.3, 0.4, 0.12, rust)
o = ring('Wheelbarrow wheel', 14, 0.42, 3.0, 0.32, 0.11, rubber, True)
o.rotation_euler.z = math.pi / 2
for x in [13.6, 14.4]:
    box('Barrow support', x, 0.4, 4.5, 0.08, 0.8, 0.08, dark)

# Discarded chair and low cabinet.
for x in [-19.6, -18.4]:
    for z in [-5.5, -4.5]:
        box('Chair leg', x, 0.43, z, 0.12, 0.86, 0.12, wood)
box('Chair seat', -19, 0.9, -5, 1.5, 0.15, 1.4, red)
box('Chair back', -19, 1.55, -5.6, 1.5, 1.2, 0.12, red)
solid(-19, -5, 0.75, 0.7, 2.2)
box('Old cupboard', 26, 0.85, -10, 3.0, 1.7, 1.1, wood)
solid(26, -10, 1.5, 0.55, 1.7)
for x in [25.25, 26.75]:
    box('Cupboard door', x, 0.85, -9.42, 1.4, 1.55, 0.07, teal)
    box('Drawer pull', x, 1.05, -9.35, 0.3, 0.06, 0.07, dark)

# Hollow pipe sections, flowerpots, cones, glass bottles and small tins.
for i in range(5):
    x = 17 + i * 0.55
    z = -11.5
    ring('Pipe mouth', x, 0.4, z, 0.27, 0.08, blue, True)
    o = cyl('Pipe section', x, 0.4, z - 0.8, 0.34, 1.6, blue)
    o.rotation_euler.x = math.pi / 2
for x, z in [(-17, 13), (-16, 15), (27, 13)]:
    box('Cone foot', x, 0.05, z, 0.75, 0.1, 0.75, dark)
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.3, radius2=0.07, depth=0.85, location=V(x, 0.52, z))
    o = bpy.context.object
    o.name = 'Traffic cone'
    o.data.materials.append(red)
    objects.append(o)
    cyl('Cone stripe', x, 0.6, z, 0.17, 0.14, cream)
for x, z in [(10, 33), (13.8, 34), (26, 17)]:
    cyl('Flowerpot', x, 0.3, z, 0.34, 0.6, rust)
    cyl('Pot soil', x, 0.61, z, 0.28, 0.025, soil)
for i in range(18):
    x = random.choice([-17, 25]) + random.uniform(-1, 1)
    z = random.choice([7, 21]) + random.uniform(-1, 1)
    cyl('Bottle body', x, 0.21, z, 0.11, 0.42, green)
    cyl('Bottle neck', x, 0.5, z, 0.05, 0.17, green)
for i in range(14):
    cyl('Discarded food tin', -15 + random.random() * 3, 0.13, 18 + random.random() * 3, 0.12, 0.26, blue)

# Bevel larger solid props, keeping tiny boards inexpensive.
for o in objects:
    if o.type == 'MESH' and o.name.startswith(('Abandoned fridge', 'Washing machine', 'Old cupboard', 'Crate core', 'Chair seat', 'Fridge door')):
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = o.modifiers.new('Soft cartoon edges', 'BEVEL')
        mod.width = 0.055
        mod.segments = 2
        bpy.ops.object.modifier_apply(modifier=mod.name)
        o.select_set(False)

# Merge by material: small mobile draw-call count, shared static map geometry.
for m in list(bpy.data.materials):
    group = [o for o in list(bpy.data.objects) if o.type == 'MESH' and len(o.data.materials) and (o.data.materials[0] == m)]
    if not group:
        continue
    bpy.ops.object.select_all(action='DESELECT')
    for o in group:
        o.select_set(True)
    bpy.context.view_layer.objects.active = group[0]
    bpy.ops.object.join()
    group[0].name = m.name
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(P / 'junkyard.glb'), export_format='GLB', export_yup=True, export_animations=False)
(P / 'map-collision.json').write_text(json.dumps(dict(obstacles=obstacles, platforms=platforms)))

# Actual asset render, with a clear isometric view of the gate and shed.
world = bpy.context.scene.world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (0.075, 0.12, 0.13, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = 0.7
bpy.ops.object.light_add(type='AREA', location=(0, -5, 45))
bpy.context.object.data.energy = 25000
bpy.context.object.data.size = 35
bpy.ops.object.camera_add(location=V(65, 60, 78))
cam = bpy.context.object
cam.rotation_euler = (Vector(V(5, 0, 12)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 83
sc = bpy.context.scene
sc.camera = cam
sc.render.engine = 'CYCLES'
sc.view_settings.exposure = 0.5
sc.cycles.samples = 12
sc.cycles.use_denoising = True
sc.render.resolution_x = 1200
sc.render.resolution_y = 900
sc.render.resolution_percentage = 100
sc.render.filepath = str(P / 'Junkyard-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(P / 'Junkyard.blend'))
bpy.ops.render.render(write_still=True)