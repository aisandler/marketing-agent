'use client';

import { useRef, Suspense, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Loading spinner component
function Loader() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshBasicMaterial color="#6c5ce7" wireframe />
        </mesh>
    );
}

// Animated box component
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

// Animated sphere component
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

// Default scene with example objects
function DefaultScene() {
    return (
        <>
            <Box />
            <Sphere />
        </>
    );
}

// Props interface
interface ThreeCanvasProps {
    children?: ReactNode;
    className?: string;
    showDefaultScene?: boolean;
}

export default function ThreeCanvas({
    children,
    className = '',
    showDefaultScene = true
}: ThreeCanvasProps) {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                shadows
                camera={{ position: [3, 3, 3], fov: 75 }}
                gl={{
                    antialias: true,
                    powerPreference: 'high-performance'
                }}
                dpr={[1, 2]}
                onCreated={({ gl }) => {
                    gl.setClearColor('#1a1a2e');
                }}
            >
                <Suspense fallback={<Loader />}>
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={1}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Scene content */}
                    {showDefaultScene && <DefaultScene />}
                    {children}

                    {/* Environment and shadows */}
                    <Environment preset="studio" />
                    <ContactShadows
                        position={[0, 0, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={4}
                    />

                    {/* Controls */}
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        target={[0, 0.5, 0]}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
