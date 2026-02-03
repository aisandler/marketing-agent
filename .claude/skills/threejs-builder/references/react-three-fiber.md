# React Three Fiber Reference

## R3F vs Vanilla Three.js

| Aspect | Vanilla | React Three Fiber |
|--------|---------|-------------------|
| Setup | Imperative (create, add, render) | Declarative (JSX components) |
| State | Manual updates | React state triggers re-renders |
| Lifecycle | Manual disposal | Automatic cleanup |
| Animation | requestAnimationFrame | useFrame hook |
| Best for | Full control, non-React projects | React apps, component reuse |

## Essential Hooks

### useFrame
Runs every frame (60fps). Use for animations.

```tsx
import { useFrame } from '@react-three/fiber';

function AnimatedBox() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        // state.clock.elapsedTime - total time
        // state.clock.getDelta() or delta - time since last frame
        // state.camera, state.scene, state.gl - access Three.js objects

        if (meshRef.current) {
            meshRef.current.rotation.y += delta;
        }
    });

    return <mesh ref={meshRef}>...</mesh>;
}
```

### useThree
Access the Three.js context.

```tsx
import { useThree } from '@react-three/fiber';

function CameraController() {
    const { camera, gl, scene, size, viewport } = useThree();

    // size: { width, height } in pixels
    // viewport: { width, height } in Three.js units

    useEffect(() => {
        camera.position.set(0, 5, 10);
    }, [camera]);

    return null;
}
```

### useLoader
Load assets with suspense support.

```tsx
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';

function Model() {
    const gltf = useLoader(GLTFLoader, '/model.glb');
    return <primitive object={gltf.scene} />;
}

function TexturedBox() {
    const texture = useLoader(TextureLoader, '/texture.jpg');
    return (
        <mesh>
            <boxGeometry />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}
```

## Drei Components Catalog

### Controls
```tsx
import { OrbitControls, FlyControls, PointerLockControls } from '@react-three/drei';

<OrbitControls enableDamping dampingFactor={0.05} />
<FlyControls movementSpeed={5} rollSpeed={0.5} />
<PointerLockControls />
```

### Helpers
```tsx
import { Stats, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';

<Stats />  {/* FPS counter */}
<Grid infiniteGrid cellSize={0.5} sectionSize={2} />
<GizmoHelper alignment="bottom-right">
    <GizmoViewport />
</GizmoHelper>
```

### Lighting & Environment
```tsx
import { Environment, Lightformer, Sky, Stars } from '@react-three/drei';

{/* HDRI presets */}
<Environment preset="studio" />  {/* or: sunset, dawn, night, warehouse, forest, apartment, city, park, lobby */}

{/* Custom environment */}
<Environment>
    <Lightformer position={[0, 5, -5]} scale={10} intensity={2} />
</Environment>

{/* Procedural sky */}
<Sky sunPosition={[100, 20, 100]} />
<Stars radius={100} depth={50} count={5000} />
```

### Shadows
```tsx
import { ContactShadows, AccumulativeShadows, RandomizedLight } from '@react-three/drei';

{/* Simple contact shadows (no light needed) */}
<ContactShadows position={[0, 0, 0]} opacity={0.5} blur={2} />

{/* Soft accumulated shadows */}
<AccumulativeShadows temporal frames={100}>
    <RandomizedLight position={[5, 5, -5]} amount={8} />
</AccumulativeShadows>
```

### Text
```tsx
import { Text, Text3D, Billboard } from '@react-three/drei';

{/* 2D text (troika-three-text) */}
<Text fontSize={1} color="white" anchorX="center" anchorY="middle">
    Hello World
</Text>

{/* 3D extruded text */}
<Text3D font="/fonts/helvetiker_regular.typeface.json" size={1} height={0.2}>
    3D Text
    <meshStandardMaterial color="gold" />
</Text3D>

{/* Always face camera */}
<Billboard>
    <Text>I face you</Text>
</Billboard>
```

### Shapes & Geometry
```tsx
import { Box, Sphere, Plane, RoundedBox, Torus } from '@react-three/drei';

<Box args={[1, 1, 1]} position={[0, 0, 0]}>
    <meshStandardMaterial color="red" />
</Box>

<RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
    <meshStandardMaterial color="blue" />
</RoundedBox>
```

### Loading & Progress
```tsx
import { useProgress, Html } from '@react-three/drei';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(0)}%</Html>;
}

// In Canvas:
<Suspense fallback={<Loader />}>
    <Model />
</Suspense>
```

### Camera
```tsx
import { PerspectiveCamera, OrthographicCamera, CameraShake } from '@react-three/drei';

<PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
<OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
<CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} />
```

## State Management with Zustand

```tsx
import { create } from 'zustand';

interface GameState {
    score: number;
    incrementScore: () => void;
    resetScore: () => void;
}

const useGameStore = create<GameState>((set) => ({
    score: 0,
    incrementScore: () => set((state) => ({ score: state.score + 1 })),
    resetScore: () => set({ score: 0 })
}));

// In component:
function ScoreDisplay() {
    const score = useGameStore((state) => state.score);
    return <Text>{score}</Text>;
}

function Collectible() {
    const incrementScore = useGameStore((state) => state.incrementScore);

    return (
        <mesh onClick={incrementScore}>
            <sphereGeometry />
            <meshStandardMaterial color="gold" />
        </mesh>
    );
}
```

## Events & Interaction

```tsx
function InteractiveBox() {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    return (
        <mesh
            onClick={() => setClicked(!clicked)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={clicked ? 1.5 : 1}
        >
            <boxGeometry />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}
```

Available events:
- `onClick`, `onDoubleClick`
- `onPointerOver`, `onPointerOut`
- `onPointerMove`, `onPointerDown`, `onPointerUp`
- `onWheel`

## Performance Tips

1. **Limit useFrame work**: Avoid creating objects inside useFrame
2. **Use refs**: Mutate refs instead of state for animations
3. **Memoize components**: Use `React.memo` for static objects
4. **Dispose properly**: R3F handles most disposal, but manual cleanup may be needed
5. **Use instances**: For many identical objects, use `<Instances>`

```tsx
import { Instances, Instance } from '@react-three/drei';

function ManyBoxes({ count = 1000 }) {
    return (
        <Instances limit={count}>
            <boxGeometry />
            <meshStandardMaterial />
            {Array.from({ length: count }, (_, i) => (
                <Instance
                    key={i}
                    position={[Math.random() * 10, Math.random() * 10, Math.random() * 10]}
                />
            ))}
        </Instances>
    );
}
```
