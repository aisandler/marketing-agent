import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    ContactShadows,
    Grid,
    Stats,
    useHelper
} from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';

// Animated box with debug controls
function Box() {
    const meshRef = useRef<THREE.Mesh>(null);

    const { color, roughness, metalness, wireframe } = useControls('Box', {
        color: '#6c5ce7',
        roughness: { value: 0.4, min: 0, max: 1, step: 0.01 },
        metalness: { value: 0.3, min: 0, max: 1, step: 0.01 },
        wireframe: false
    });

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
                wireframe={wireframe}
            />
        </mesh>
    );
}

// Animated sphere
function Sphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    const { color, speed, amplitude } = useControls('Sphere', {
        color: '#00cec9',
        speed: { value: 2, min: 0.5, max: 5, step: 0.1 },
        amplitude: { value: 0.3, min: 0.1, max: 1, step: 0.05 }
    });

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * speed) * amplitude;
        }
    });

    return (
        <mesh ref={meshRef} position={[2, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
        </mesh>
    );
}

// Light with helper visualization
function Lights() {
    const directionalLightRef = useRef<THREE.DirectionalLight>(null);

    const { showHelper, intensity, position } = useControls('Lighting', {
        showHelper: false,
        intensity: { value: 1, min: 0, max: 3, step: 0.1 },
        position: { value: [5, 5, 5], step: 0.5 }
    });

    // Conditionally show light helper
    useHelper(
        showHelper ? directionalLightRef : { current: null },
        THREE.DirectionalLightHelper,
        1,
        '#ffff00'
    );

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight
                ref={directionalLightRef}
                position={position}
                intensity={intensity}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={0.5}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
        </>
    );
}

// Scene configuration controls
function SceneConfig() {
    const { gl } = useThree();

    const { background, showGrid, showStats } = useControls('Scene', {
        background: '#1a1a2e',
        showGrid: true,
        showStats: false
    });

    // Update background color
    gl.setClearColor(background);

    return (
        <>
            {showGrid && (
                <Grid
                    infiniteGrid
                    cellSize={0.5}
                    cellThickness={0.5}
                    cellColor="#444444"
                    sectionSize={2}
                    sectionThickness={1}
                    sectionColor="#666666"
                    fadeDistance={30}
                    fadeStrength={1}
                />
            )}
            {showStats && <Stats />}
        </>
    );
}

// Loading fallback
function Loader() {
    return (
        <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
    );
}

// Main scene
function Scene() {
    const { environment } = useControls('Environment', {
        environment: {
            value: 'studio',
            options: ['studio', 'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'city', 'park', 'lobby']
        }
    });

    return (
        <>
            <Lights />
            <SceneConfig />

            <Suspense fallback={<Loader />}>
                <Box />
                <Sphere />
                <Environment preset={environment} />
            </Suspense>

            {/* Soft contact shadows on floor */}
            <ContactShadows
                position={[0, 0, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
            />

            {/* Camera controls */}
            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                target={[0, 0.5, 0]}
                minDistance={2}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
}

export default function App() {
    return (
        <>
            {/* Leva debug panel */}
            <Leva collapsed={false} />

            <div style={{ width: '100vw', height: '100vh' }}>
                <Canvas
                    shadows
                    camera={{ position: [3, 3, 3], fov: 75 }}
                    gl={{
                        antialias: true,
                        powerPreference: 'high-performance'
                    }}
                    dpr={[1, 2]} // Limit pixel ratio for performance
                >
                    <Scene />
                </Canvas>
            </div>
        </>
    );
}
