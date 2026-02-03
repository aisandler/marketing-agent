import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Box() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#6c5ce7" roughness={0.4} metalness={0.3} />
        </mesh>
    );
}

function Sphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={[2, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#00cec9" roughness={0.2} metalness={0.5} />
        </mesh>
    );
}

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#2d2d44" roughness={0.8} />
        </mesh>
    );
}

function Scene() {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {/* Objects */}
            <Box />
            <Sphere />
            <Floor />

            {/* Helpers */}
            <gridHelper args={[10, 10, '#444444', '#333333']} />

            {/* Controls */}
            <OrbitControls enableDamping dampingFactor={0.05} target={[0, 0.5, 0]} />
        </>
    );
}

export default function App() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas
                shadows
                camera={{ position: [3, 3, 3], fov: 75 }}
                gl={{ antialias: true }}
                onCreated={({ gl }) => {
                    gl.setClearColor('#1a1a2e');
                }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
