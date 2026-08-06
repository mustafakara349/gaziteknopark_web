import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "./globeUtils";

// Custom label offsets per city to prevent overlap
const CITY_LABEL_OFFSETS = {
  london: [-0.14, 0.16, 0],
  amsterdam: [0.14, 0.14, 0],
  ankara: [0, 0.16, 0],
  dubai: [0, 0.16, 0],
};

export default function GlobeMarker({ office, radius = 2, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef();

  const pos = latLngToVector3(office.latitude, office.longitude, radius + 0.03);
  const labelOffset = CITY_LABEL_OFFSETS[office.id] || [0, 0.16, 0];

  const normal = pos.clone().normalize();
  const pinQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  // All markers use Gazi Red (#e30613)
  const beaconColor = "#e30613";
  const ringColor = "#e30613";

  return (
    <group position={pos} quaternion={pinQuaternion}>
      {/* Concentric Gazi Red Pulse Ring on Earth Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.06, 32]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Modern Soft Beacon Dot */}
      <group
        ref={pinRef}
        scale={hovered || isSelected ? [1.3, 1.3, 1.3] : [1, 1, 1]}
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
        {/* Inner Glowing Core Dot in Gazi Red */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial
            color={beaconColor}
            emissive={beaconColor}
            emissiveIntensity={hovered || isSelected ? 0.95 : 0.6}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Modern Soft City Tag Pill (All Red Accents) */}
      <Html position={labelOffset} center zIndexRange={[10, 0]}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick(office);
          }}
          className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm font-sans ${
            isSelected
              ? "bg-[#e30613] text-white border-[#e30613] ring-2 ring-[#e30613]/50 scale-105"
              : hovered
              ? "bg-[#b8040f] text-white border-[#b8040f] scale-105"
              : "bg-white/95 text-[#0B2558] border-gray-200 backdrop-blur-md hover:border-[#e30613]"
          }`}
        >
          <span className="font-extrabold text-[9px] px-1 py-0.5 rounded bg-[#e30613] text-white">
            {office.countryCode || "TR"}
          </span>
          <span className="font-bold">{office.city}</span>
        </button>
      </Html>
    </group>
  );
}
