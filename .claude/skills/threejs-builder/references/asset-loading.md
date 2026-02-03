# Asset Loading Reference

## GLTF/GLB Workflow

### Basic Loading
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load(
    'model.glb',
    (gltf) => {
        scene.add(gltf.scene);
        console.log('Loaded:', gltf);
        // gltf.scene - the root object
        // gltf.scenes - all scenes
        // gltf.cameras - embedded cameras
        // gltf.animations - animation clips
    },
    (progress) => {
        console.log(`${(progress.loaded / progress.total * 100).toFixed(0)}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);
```

### DRACO Compression
Reduces GLTF file size by 80-90%:

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dracoLoader.preload(); // Optional: preload decoder

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('compressed-model.glb', (gltf) => {
    scene.add(gltf.scene);
});
```

### Blender Export Settings
1. File > Export > glTF 2.0 (.glb/.gltf)
2. Format: **glTF Binary (.glb)** for single file
3. Include:
   - Selected Objects (or all)
   - Custom Properties (if needed)
4. Transform:
   - +Y Up (matches Three.js)
5. Geometry:
   - Apply Modifiers
   - UVs, Normals, Tangents
   - Compression: Draco (for smaller files)
6. Animation (if applicable):
   - Animations
   - Shape Keys
   - Skinning

### Post-Load Processing
```javascript
gltfLoader.load('model.glb', (gltf) => {
    const model = gltf.scene;

    // Center and scale
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    model.position.sub(center); // Center at origin
    const maxDim = Math.max(size.x, size.y, size.z);
    model.scale.multiplyScalar(2 / maxDim); // Normalize to ~2 units

    // Enable shadows on all meshes
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Fix material issues
            if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
        }
    });

    scene.add(model);
});
```

## Texture Loading

### Basic Textures
```javascript
const textureLoader = new THREE.TextureLoader();

const colorTexture = textureLoader.load('color.jpg');
colorTexture.colorSpace = THREE.SRGBColorSpace;

const normalTexture = textureLoader.load('normal.jpg');
// Normal maps stay in linear space (no colorSpace change)

const roughnessTexture = textureLoader.load('roughness.jpg');
// Roughness/metalness stay in linear space

const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture
});
```

### Texture Wrapping & Repeat
```javascript
const texture = textureLoader.load('tile.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4); // Tile 4x4

// Other wrap modes:
// THREE.ClampToEdgeWrapping (default)
// THREE.MirroredRepeatWrapping
```

### Texture Filtering
```javascript
// Magnification (close up)
texture.magFilter = THREE.LinearFilter; // Smooth (default)
texture.magFilter = THREE.NearestFilter; // Pixelated

// Minification (far away)
texture.minFilter = THREE.LinearMipmapLinearFilter; // Best quality (default)
texture.minFilter = THREE.NearestFilter; // Performance
```

## HDRI Environment Maps

### RGBELoader
```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load('environment.hdr', (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.environment = envMap; // For reflections on all PBR materials
    scene.background = envMap;  // As visible background

    texture.dispose();
    pmremGenerator.dispose();
});
```

### EXRLoader
For .exr files (higher dynamic range):
```javascript
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

new EXRLoader().load('environment.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});
```

### Free HDRI Sources
- [Poly Haven](https://polyhaven.com/hdris) - CC0 license
- [HDRI Haven](https://hdrihaven.com/) - CC0 license

## Loading Manager

### Track Multiple Assets
```javascript
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, loaded, total) => {
    console.log(`Started loading: ${url}`);
    console.log(`Loading ${loaded} of ${total}`);
};

loadingManager.onProgress = (url, loaded, total) => {
    const progress = (loaded / total * 100).toFixed(0);
    console.log(`Loading: ${progress}%`);
    // Update progress bar
};

loadingManager.onLoad = () => {
    console.log('All assets loaded');
    // Hide loading screen, start experience
};

loadingManager.onError = (url) => {
    console.error(`Error loading: ${url}`);
};

// Use manager with loaders
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
```

### React Three Fiber with useProgress
```tsx
import { useProgress, Html } from '@react-three/drei';

function Loader() {
    const { progress, active, loaded, total } = useProgress();

    return active ? (
        <Html center>
            <div className="loader">
                <div className="progress-bar">
                    <div style={{ width: `${progress}%` }} />
                </div>
                <p>{progress.toFixed(0)}% loaded</p>
            </div>
        </Html>
    ) : null;
}
```

## Audio Loading

```javascript
const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();

// Positional audio (3D)
const sound = new THREE.PositionalAudio(listener);
audioLoader.load('sound.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setRefDistance(10);
    sound.setLoop(true);
    sound.play();
});
mesh.add(sound);

// Global audio
const ambientSound = new THREE.Audio(listener);
audioLoader.load('ambient.mp3', (buffer) => {
    ambientSound.setBuffer(buffer);
    ambientSound.setVolume(0.5);
    ambientSound.play();
});
```

## Video Textures

```javascript
const video = document.createElement('video');
video.src = 'video.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({ map: videoTexture });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), material);
scene.add(screen);
```

## Caching Strategies

### Browser Cache
Set appropriate cache headers on your server:
```
Cache-Control: public, max-age=31536000
```

### Preload Critical Assets
```javascript
// Preload in parallel before scene initialization
const texturePromises = [
    textureLoader.loadAsync('texture1.jpg'),
    textureLoader.loadAsync('texture2.jpg'),
    gltfLoader.loadAsync('model.glb')
];

Promise.all(texturePromises).then(([tex1, tex2, gltf]) => {
    // All assets ready, initialize scene
});
```

### IndexedDB for Large Assets
For offline support or large asset caching, consider storing assets in IndexedDB using libraries like `localforage`.
