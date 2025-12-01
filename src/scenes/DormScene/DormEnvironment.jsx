import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from 'react';

export default function DormEnvironment() {
  const gltf = useLoader(GLTFLoader, '/models/qcu_dorm.glb');
  return (
    <>
      <Suspense fallback={<span>Loading...</span>}>
        <primitive object={gltf.scene} position={[0, 0, 0]} scale={[1.65, 1.65, 1.65]} />
      </Suspense>

      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <ambientLight intensity={1.2} />
    </>
  );
}
