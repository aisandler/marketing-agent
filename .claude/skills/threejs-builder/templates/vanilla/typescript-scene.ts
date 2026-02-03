import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Types
interface Sizes {
    width: number;
    height: number;
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Sizes
const sizes: Sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
camera.position.set(3, 3, 3);

// Renderer
const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
if (!canvas) throw new Error('Canvas element not found');

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d2d44,
    roughness: 0.8
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x6c5ce7,
    roughness: 0.4,
    metalness: 0.3
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;
cube.castShadow = true;
scene.add(cube);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x00cec9,
    roughness: 0.2,
    metalness: 0.5
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 0.5, 0);
sphere.castShadow = true;
scene.add(sphere);

// Grid helper
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x333333);
scene.add(gridHelper);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.5, 0);

// Clock for animation
const clock = new THREE.Clock();

// Animation loop
function animate(): void {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Rotate cube
    cube.rotation.y = elapsed * 0.5;

    // Bounce sphere
    sphere.position.y = 0.5 + Math.sin(elapsed * 2) * 0.3;

    controls.update();
    renderer.render(scene, camera);
}

// Resize handling
function handleResize(): void {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);

// Cleanup function (call when unmounting)
export function dispose(): void {
    window.removeEventListener('resize', handleResize);

    // Dispose geometries
    cubeGeometry.dispose();
    sphereGeometry.dispose();
    floorGeometry.dispose();

    // Dispose materials
    cubeMaterial.dispose();
    sphereMaterial.dispose();
    floorMaterial.dispose();

    // Dispose renderer
    renderer.dispose();
    controls.dispose();
}

// Start animation
animate();
