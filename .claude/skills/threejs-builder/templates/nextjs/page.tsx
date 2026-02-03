import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled (Three.js requires browser APIs)
const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center bg-[#1a1a2e]">
            <div className="text-white text-lg">Loading 3D scene...</div>
        </div>
    )
});

export default function Page() {
    return (
        <main className="w-full h-screen">
            <ThreeCanvas />
        </main>
    );
}

// ============================================================
// USAGE NOTES:
// ============================================================
//
// 1. Place ThreeCanvas component at: components/ThreeCanvas.tsx
//    (or update the import path above)
//
// 2. Install dependencies:
//    npm install three @react-three/fiber @react-three/drei
//    npm install -D @types/three
//
// 3. The ThreeCanvas component accepts props:
//    - children: Custom 3D elements to render
//    - className: Additional CSS classes
//    - showDefaultScene: Whether to show example objects (default: true)
//
// 4. Example with custom content:
//
//    function MyCustomScene() {
//        return (
//            <mesh position={[0, 1, 0]}>
//                <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
//                <meshStandardMaterial color="orange" />
//            </mesh>
//        );
//    }
//
//    export default function Page() {
//        return (
//            <main className="w-full h-screen">
//                <ThreeCanvas showDefaultScene={false}>
//                    <MyCustomScene />
//                </ThreeCanvas>
//            </main>
//        );
//    }
//
// 5. For full-page 3D backgrounds, add to your global CSS:
//    body { margin: 0; overflow: hidden; }
//
// ============================================================
