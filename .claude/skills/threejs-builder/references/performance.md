# Three.js Performance Optimization

## Profiling Tools

### Stats.js
```javascript
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS, 2: MB
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    // ... render
    stats.end();
    requestAnimationFrame(animate);
}
```

### Browser DevTools
- **Performance tab**: Record and analyze frame timing
- **Memory tab**: Track heap allocations and leaks
- **Layers tab**: Visualize GPU layers

### Three.js Inspector
Chrome extension for inspecting Three.js scenes: [three-devtools](https://github.com/nicolo-ribaudo/three-devtools)

## Geometry Optimization

### Instanced Meshes
For rendering many identical objects:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const count = 1000;

const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
scene.add(instancedMesh);

const matrix = new THREE.Matrix4();
for (let i = 0; i < count; i++) {
    matrix.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    instancedMesh.setMatrixAt(i, matrix);
}
instancedMesh.instanceMatrix.needsUpdate = true;
```

### Merge Static Geometries
```javascript
import { BufferGeometryUtils } from 'three/addons/utils/BufferGeometryUtils.js';

const geometries = [];
for (let i = 0; i < 100; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(i * 2, 0, 0);
    geometries.push(geo);
}

const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
const mesh = new THREE.Mesh(mergedGeometry, material);
```

### Level of Detail (LOD)
```javascript
const lod = new THREE.LOD();

// High detail (near)
const highDetail = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    material
);
lod.addLevel(highDetail, 0);

// Medium detail
const mediumDetail = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    material
);
lod.addLevel(mediumDetail, 50);

// Low detail (far)
const lowDetail = new THREE.Mesh(
    new THREE.SphereGeometry(1, 8, 8),
    material
);
lod.addLevel(lowDetail, 100);

scene.add(lod);

// Update in animation loop
lod.update(camera);
```

### Reduce Triangle Count
- Target: <100k triangles for complex scenes
- Use decimation tools in Blender (Decimate modifier)
- Prefer simpler geometries where possible

## Material Optimization

### Reuse Materials
```javascript
// BAD: Creates new material for each mesh
meshes.forEach(mesh => {
    mesh.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
});

// GOOD: Share material
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
meshes.forEach(mesh => {
    mesh.material = sharedMaterial;
});
```

### Use Appropriate Material Complexity
| Distance/Importance | Material |
|---------------------|----------|
| Far/background | MeshBasicMaterial |
| Medium | MeshLambertMaterial |
| Close/hero | MeshStandardMaterial |
| Special effects | MeshPhysicalMaterial |

### Disable Unused Features
```javascript
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    transparent: false,      // Disable if not needed
    flatShading: false,      // Disable if not needed
    fog: false,              // Disable if not using fog
    depthWrite: true,        // Keep enabled usually
    depthTest: true          // Keep enabled usually
});
```

## Texture Optimization

### Compress Textures
Use KTX2 with Basis Universal for GPU-compressed textures:

```javascript
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader()
    .setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/')
    .detectSupport(renderer);

ktx2Loader.load('texture.ktx2', (texture) => {
    material.map = texture;
    material.needsUpdate = true;
});
```

### Texture Size Guidelines
| Use Case | Max Size |
|----------|----------|
| Mobile | 1024x1024 |
| Desktop | 2048x2048 |
| Hero objects | 4096x4096 |

### Mipmaps
Enabled by default. Ensure textures are power-of-2 dimensions (256, 512, 1024, 2048).

### Texture Atlases
Combine multiple textures into one to reduce draw calls.

## Rendering Optimization

### Pixel Ratio
```javascript
// Limit to 2x for performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

### Frustum Culling
Enabled by default. Ensure bounding spheres are computed:
```javascript
geometry.computeBoundingSphere();
```

### Occlusion Culling
For complex scenes, implement manual occlusion:
```javascript
object.frustumCulled = true; // Default
// Or implement visibility checks
```

### Shadow Optimization
```javascript
// Lower resolution for mobile
directionalLight.shadow.mapSize.set(512, 512);  // Mobile
directionalLight.shadow.mapSize.set(1024, 1024); // Desktop
directionalLight.shadow.mapSize.set(2048, 2048); // High quality

// Tighter shadow camera bounds
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
```

### Antialias Alternatives
```javascript
// Standard antialiasing (expensive)
new THREE.WebGLRenderer({ antialias: true });

// FXAA post-processing (cheaper)
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
const fxaaPass = new FXAAPass();
fxaaPass.uniforms['resolution'].value.set(1 / width, 1 / height);
composer.addPass(fxaaPass);
```

## Memory Management

### Dispose Pattern
```javascript
function disposeObject(object) {
    if (object.geometry) {
        object.geometry.dispose();
    }

    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(mat => disposeMaterial(mat));
        } else {
            disposeMaterial(object.material);
        }
    }

    if (object.children) {
        object.children.forEach(child => disposeObject(child));
    }
}

function disposeMaterial(material) {
    Object.keys(material).forEach(key => {
        const value = material[key];
        if (value && typeof value.dispose === 'function') {
            value.dispose();
        }
    });
    material.dispose();
}

// Usage
scene.remove(object);
disposeObject(object);
```

### Texture Disposal
```javascript
texture.dispose();
renderer.dispose();
```

### Monitor Memory
```javascript
console.log(renderer.info.memory);
// { geometries: 10, textures: 5 }

console.log(renderer.info.render);
// { calls: 15, triangles: 50000, points: 0, lines: 0 }
```

## Mobile Optimization

### Reduce Quality
```javascript
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

if (isMobile) {
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    // Use simpler materials
    // Reduce geometry complexity
    // Limit particle counts
}
```

### Performance Budgets
| Metric | Mobile | Desktop |
|--------|--------|---------|
| Draw calls | <50 | <200 |
| Triangles | <50k | <500k |
| Texture memory | <64MB | <256MB |
| Target FPS | 30 | 60 |
