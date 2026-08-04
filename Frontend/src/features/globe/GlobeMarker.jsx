import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "./GlobeScene";

// Custom label offsets per city to prevent overlap in densely populated regions (e.g. London & Amsterdam)
const CITY_LABEL_OFFSETS = {
  london: [-0.14, 0.18, 0],   // Top-left offset for London
  amsterdam: [0.14, 0.14, 0], // Top-right offset for Amsterdam
  ankara: [0, 0.16, 0],       // Centered for Ankara
  dubai: [0, 0.16, 0],        // Centered for Dubai
};

export default function GlobeMarker({ office, radius = 2, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef();

  const pos = latLngToVector3(office.latitude, office.longitude, radius + 0.03);
  const labelOffset = CITY_LABEL_OFFSETS[office.id] || [0, 0.16, 0];

  // Normal vector pointing outward from sphere center
  const normal = pos.clone().normalize();
  const pinQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  return (
    <group position={pos} quaternion={pinQuaternion}>
      {/* Concentric Glowing Red Pulse Rings on Earth Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.05, 32]} />
        <meshBasicMaterial color="#e30613" transparent opacity={hovered || isSelected ? 0.9 : 0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* 3D Premium Pushpin (Raptiye) Mesh Group */}
      <group
        ref={pinRef}
        scale={hovered || isSelected ? [1.2, 1.2, 1.2] : [0.9, 0.9, 0.9]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(office);
        }}
      >
        {/* Silver Metallic Pin Needle Tip */}
        <mesh position={[0, 0.04, 0]}>
          <coneGeometry args={[0.01, 0.08, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Red Metallic Pushpin Body Rim */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.035, 0.016, 0.025, 16]} />
          <meshStandardMaterial color="#e30613" roughness={0.15} metalness={0.2} />
        </mesh>

        {/* Red Metallic Pushpin Knob Head */}
        <mesh position={[0, 0.105, 0]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshStandardMaterial
            color="#e30613"
            emissive="#e30613"
            emissiveIntensity={isSelected ? 0.7 : 0.3}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Micro Glassmorphic City Tag Label with Smart Offset to Prevent Overlap */}
      <Html
        position={labelOffset}
        center
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick(office);
          }}
          className={`group flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold tracking-tight uppercase transition-all duration-200 cursor-pointer whitespace-nowrap border border-white/20 shadow-xs ${
            isSelected
              ? "bg-[#e30613] text-white ring-1 ring-white/60 scale-95"
              : hovered
              ? "bg-[#082b5c] text-white scale-95"
              : "bg-[#051d40]/85 text-white/90 backdrop-blur-xs hover:border-white/50"
          }`}
          style={{ transform: "scale(0.85)" }}
        >
          <span className="text-[9px]">{office.flag}</span>
          <span className="font-extrabold">{office.city}</span>
        </button>
      </Html>
    </group>
  );
}
