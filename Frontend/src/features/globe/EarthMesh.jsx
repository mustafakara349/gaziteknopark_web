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
      cloudsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Soft Atmosphere Glow */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial
          color="#0066cc"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main 3D Earth Sphere with Authentic High-Res Earth Texture */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial
          map={texture}
          emissive="#051d40"
          emissiveIntensity={0.15}
          specular="#0066cc"
          shininess={20}
        />
      </mesh>

      {/* Ultra Subtle Grid Overlay */}
      <mesh scale={[1.001, 1.001, 1.001]}>
        <sphereGeometry args={[radius, 36, 18]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Translucent Cloud Layer Mesh */}
      <mesh ref={cloudsRef} scale={[1.015, 1.015, 1.015]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.14} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
