import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// High-resolution authentic NASA / Three.js equirectangular Earth Texture
const EARTH_TEXTURE_URL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg";

export default function EarthMesh({ radius = 2, earthRef }) {
  const texture = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);
  const cloudsRef = useRef();

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Outer Atmosphere Soft Blue Glow (No Red Glow) */}
      <mesh scale={[1.045, 1.045, 1.045]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial
          color="#38bdf8"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main 3D Earth Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.55}
          metalness={0.1}
          color="#ffffff"
        />
      </mesh>

      {/* Subtle Grid Overlay */}
      <mesh scale={[1.002, 1.002, 1.002]}>
        <sphereGeometry args={[radius, 36, 18]} />
        <meshBasicMaterial color="#0066cc" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Translucent Cloud Layer */}
      <mesh ref={cloudsRef} scale={[1.018, 1.018, 1.018]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
