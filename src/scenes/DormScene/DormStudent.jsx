import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAnimationState } from "../../hooks/useAnimationState";

export default function DormStudent({ animation = "walking", position = [0, -0.35, 1], scale = 0.035 }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/qcu_student_1.glb");

  const { play, update } = useAnimationState(animations, scene);

  useEffect(() => {
    if (animation) play(animation);
  }, [animation]);

  useFrame((_, delta) => update(delta));

  return (
    <primitive ref={group} object={scene} position={position} scale={[scale, scale, scale]} />
  );
}
