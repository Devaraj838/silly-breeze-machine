import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface FanSceneProps {
  spinning: boolean;
}

function Fan({ spinning }: FanSceneProps) {
  const group = useRef<THREE.Group>(null!);
  const blades = useRef<THREE.Group>(null!);

  // Subtle pointer reactive tilt targets
  const tilt = useRef({ x: 0, y: 0 });

  // Materials memoized for perf
  const materials = useMemo(() => ({
    metal: new THREE.MeshStandardMaterial({ color: new THREE.Color(0x8fa3b8), metalness: 0.8, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: new THREE.Color(0x2b3a4a), metalness: 0.4, roughness: 0.6 }),
    blade: new THREE.MeshStandardMaterial({ color: new THREE.Color(0x9ec7ff), metalness: 0.2, roughness: 0.35, transparent: true, opacity: 0.9 }),
    ring: new THREE.MeshStandardMaterial({ color: new THREE.Color(0x6b93c0), metalness: 0.5, roughness: 0.4 }),
  }), []);

  useFrame((state, delta) => {
    // Signature micro-interaction: gentle parallax tilt following pointer
    const { x, y } = state.pointer;
    const targetX = y * 0.15; // invert for natural tilt
    const targetY = x * 0.25;
    tilt.current.x += (targetX - tilt.current.x) * 0.04;
    tilt.current.y += (targetY - tilt.current.y) * 0.04;
    if (group.current) {
      group.current.rotation.x = tilt.current.x;
      group.current.rotation.y = tilt.current.y;
    }

    if (spinning && blades.current) {
      // Spin blades at a fun speed; keep delta-based for frame independence
      blades.current.rotation.z -= delta * 9.0;
    }
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Base */}
      <mesh position={[0, -1.2, 0]} material={materials.dark} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.25, 24]} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, -0.5, 0]} material={materials.metal} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.3, 16]} />
      </mesh>

      {/* Head + Housing */}
      <mesh position={[0, 0.3, 0]} material={materials.metal} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
      </mesh>

      {/* Guard ring */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.ring}>
        <torusGeometry args={[0.85, 0.03, 16, 64]} />
      </mesh>

      {/* Hub */}
      <mesh position={[0, 0.3, 0.05]} material={materials.dark}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
      </mesh>

      {/* Blades */}
      <group ref={blades} position={[0, 0.3, 0.06]}>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => (
          <mesh key={angle} rotation={[0, 0, angle]} material={materials.blade} castShadow>
            <boxGeometry args={[1.2, 0.18, 0.04]} />
            {/* Round tips using small cylinders */}
            <mesh position={[0.6, 0, 0]} material={materials.blade}>
              <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
            </mesh>
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function FanScene({ spinning }: FanSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [2.2, 1.6, 3.2], fov: 42 }}
      gl={{ antialias: true }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
      <hemisphereLight args={[0xffffff, 0x223344, 0.5]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.33, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={new THREE.Color(0xf2f5f9)} />
      </mesh>

      <Fan spinning={spinning} />
    </Canvas>
  );
}
