---
name: threejs-builder
description: Knowledge and utilities for creating Three.js 3D applications and scenes. Provides scene setup patterns, animation loops, lighting configurations, asset loading (GLTF, textures), and integration templates for vanilla JavaScript, TypeScript, React Three Fiber, and Next.js. Use when users request 3D graphics, WebGL scenes, Three.js projects, React Three Fiber (R3F) applications, 3D visualizations, 3D product viewers, or interactive 3D experiences.
---

# Three.js Builder

A toolkit for creating Three.js 3D applications and integrating 3D graphics into existing projects.

## Requirements

**Browser Compatibility:**
- WebGL 2.0 required (all modern browsers)
- Mobile: Reduce shader complexity and geometry count

**Performance Targets:**
- 60 FPS desktop / 30 FPS mobile
- Draw calls: <100 for complex scenes
- Texture memory: <256MB total

**Dependencies:**
```bash
# Vanilla / TypeScript
npm install three
npm install -D @types/three

# React Three Fiber
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three

# Optional utilities
npm install gsap leva stats.js
```

## Core Workflow: Vanilla JavaScript

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 2. Add objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 3. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(ambientLight, directionalLight);

// 4. Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 5. Animation loop
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// 6. Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
```

## Core Workflow: React Three Fiber

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function Box() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    );
}

export default function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <Box />
            <OrbitControls enableDamping />
            <Environment preset="studio" />
        </Canvas>
    );
}
```

## Available Templates

### Vanilla JavaScript (`templates/vanilla/`)
- **basic-scene.html**: Single-file HTML with Three.js via CDN - open directly in browser
- **typescript-scene.ts**: TypeScript module starter for bundler projects

### React Three Fiber (`templates/react/`)
- **r3f-basic.tsx**: Minimal R3F setup with Canvas and basic scene
- **r3f-with-controls.tsx**: Full setup with Drei helpers, Suspense, debug panel

### Next.js (`templates/nextjs/`)
- **page.tsx**: App Router page with SSR-safe dynamic import
- **three-canvas.tsx**: `'use client'` component wrapper

## Scene Hierarchy

```
Scene
├── Lights
│   ├── AmbientLight (global fill)
│   ├── DirectionalLight (sun-like)
│   ├── PointLight (bulb-like)
│   └── SpotLight (cone)
├── Camera
│   ├── PerspectiveCamera (3D scenes)
│   └── OrthographicCamera (2D/isometric)
├── Objects
│   ├── Mesh = Geometry + Material
│   ├── Group (transform multiple objects)
│   └── Helpers (AxesHelper, GridHelper)
└── Environment (Skybox, HDRI, Fog)
```

## Materials Guide

| Material | Use Case | Performance |
|----------|----------|-------------|
| MeshBasicMaterial | Unlit, debug, performance-critical | Fast |
| MeshLambertMaterial | Non-shiny surfaces, diffuse only | Fast |
| MeshPhongMaterial | Shiny surfaces, specular highlights | Medium |
| MeshStandardMaterial | PBR, realistic lighting | Medium |
| MeshPhysicalMaterial | Glass, clearcoat, transmission | Slow |
| ShaderMaterial | Custom effects | Varies |

## Lighting Patterns

### Three-Point Lighting
```javascript
// Key light (main)
const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(5, 5, 5);

// Fill light (softer, opposite side)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 0, 5);

// Back light (rim/separation)
const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(0, 5, -5);

scene.add(keyLight, fillLight, backLight);
```

### Environment-Based (HDRI)
```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const pmremGenerator = new THREE.PMREMGenerator(renderer);
new RGBELoader().load('environment.hdr', (texture) => {
    scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
});
```

## Animation Patterns

### Clock-Based Animation
```javascript
const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();      // Time since last frame
    const elapsed = clock.getElapsedTime(); // Total time

    mesh.rotation.y += delta * 0.5;          // Smooth rotation
    mesh.position.y = Math.sin(elapsed) * 0.5; // Oscillation

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
```

### GSAP Integration
```javascript
import gsap from 'gsap';

gsap.to(mesh.position, {
    x: 5,
    duration: 2,
    ease: 'power2.inOut'
});

gsap.to(mesh.rotation, {
    y: Math.PI * 2,
    duration: 3,
    repeat: -1,
    ease: 'none'
});
```

## Controls Reference

| Control | Use Case | Import |
|---------|----------|--------|
| OrbitControls | Rotate around target | three/addons/controls/OrbitControls.js |
| FlyControls | Free-flying camera | three/addons/controls/FlyControls.js |
| PointerLockControls | FPS-style | three/addons/controls/PointerLockControls.js |
| DragControls | Drag objects | three/addons/controls/DragControls.js |
| TransformControls | Move/rotate/scale gizmo | three/addons/controls/TransformControls.js |

## Asset Loading

### GLTF Models
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Optional: DRACO compression for smaller files
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('model.glb', (gltf) => {
    scene.add(gltf.scene);

    // Enable shadows on all meshes
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
});
```

### Textures
```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('texture.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(2, 2);

const material = new THREE.MeshStandardMaterial({ map: texture });
```

**See `references/asset-loading.md` for advanced loading patterns.**

## Optimization

### Geometry
- Use `BufferGeometry` (default in modern Three.js)
- Merge static geometries: `BufferGeometryUtils.mergeGeometries()`
- Use instancing for repeated objects: `InstancedMesh`
- Enable LOD for distant objects

### Materials
- Reuse materials across meshes
- Use texture atlases
- Disable `transparent` when not needed
- Use simpler materials for distant objects

### Rendering
```javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
renderer.powerPreference = 'high-performance';

// Shadows (expensive)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
directionalLight.shadow.mapSize.set(1024, 1024); // Lower for mobile
```

### Memory Management
```javascript
// Always dispose when removing objects
geometry.dispose();
material.dispose();
texture.dispose();
renderer.dispose();
scene.remove(mesh);
```

**See `references/performance.md` for comprehensive optimization guide.**

## Next.js Integration

SSR requires special handling since Three.js uses browser APIs:

```tsx
// components/ThreeCanvas.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function ThreeCanvas({ children }: { children: React.ReactNode }) {
    return (
        <Canvas>
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </Canvas>
    );
}
```

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), {
    ssr: false
});

export default function Page() {
    return <ThreeCanvas>{/* 3D content */}</ThreeCanvas>;
}
```

**See `references/react-three-fiber.md` for R3F best practices.**

## Common Patterns

### Responsive Canvas
```javascript
const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```

### Shadows Setup
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

mesh.castShadow = true;
floor.receiveShadow = true;
```

### Post-Processing
```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,  // strength
    0.4,  // radius
    0.85  // threshold
));

// In animation loop: composer.render() instead of renderer.render()
```

## Decision Tree

```
User request → Is it a simple demo/prototype?
    ├─ Yes → templates/vanilla/basic-scene.html
    │
    └─ No → Is it a React project?
        ├─ Yes → Is it Next.js?
        │   ├─ Yes → templates/nextjs/ (page.tsx + three-canvas.tsx)
        │   └─ No → templates/react/r3f-with-controls.tsx
        │
        └─ No → Is it TypeScript?
            ├─ Yes → templates/vanilla/typescript-scene.ts
            └─ No → templates/vanilla/basic-scene.html (modify for project)
```

## Reference Files

- **references/react-three-fiber.md** - R3F patterns, hooks, Drei components, state management
- **references/performance.md** - Profiling, instancing, compression, mobile optimization
- **references/asset-loading.md** - GLTF workflow, DRACO, HDRI, texture optimization
