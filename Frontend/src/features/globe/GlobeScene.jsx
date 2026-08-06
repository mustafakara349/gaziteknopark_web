import { useRef, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import EarthMesh from "./EarthMesh";
import GlobeMarker from "./GlobeMarker";
import { latLngToVector3 } from "./globeUtils";
export { latLngToVector3 };

// Initial default rotation offset to center Gazi Teknopark (Gölbaşı) directly facing the camera
const ANKARA_INITIAL_ROTATION_Y = -((32.8085 + 90) * (Math.PI / 180));
const ANKARA_INITIAL_ROTATION_X = 0.35; // Soft tilt for Northern Hemisphere

// Gazi Red Curved 3D Connection Lines (Ankara -> International Hubs)
function GaziConnectingArcs({ offices, radius = 2 }) {
  if (!offices || offices.length < 2) return null;

  const ankara = offices.find((o) => o.id === "ankara") || offices[0];
  const pAnkara = latLngToVector3(ankara.latitude, ankara.longitude, radius + 0.04);

  const curves = offices
    .filter((o) => o.id !== ankara.id)
    .map((dest) => {
      const pDest = latLngToVector3(dest.latitude, dest.longitude, radius + 0.04);
      const midPoint = new THREE.Vector3().addVectors(pAnkara, pDest).multiplyScalar(0.5);
      midPoint.normalize().multiplyScalar(radius + 0.45);

      const curve = new THREE.QuadraticBezierCurve3(pAnkara, midPoint, pDest);
      const points = curve.getPoints(40);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return { id: dest.id, geometry };
    });

  return (
    <group>
      {curves.map(({ id, geometry }) => {
        const lineRef = (line) => {
          if (line) line.computeLineDistances();
        };
        return (
          <line key={id} ref={lineRef} geometry={geometry}>
            <lineDashedMaterial
              color="#e30613"
              dashSize={0.09}
              gapSize={0.04}
              linewidth={2}
              transparent
              opacity={0.85}
            />
          </line>
        );
      })}
    </group>
  );
}

// Synchronized Earth Group initially centered directly on Ankara/Türkiye
function SynchronizedEarthGroup({ offices, selectedOffice, onSelectOffice, earthGroupRef }) {
  const radius = 2;
  const isAutoRotating = !selectedOffice;

  useEffect(() => {
    if (!earthGroupRef.current) return;
    if (!selectedOffice) {
      // Focus directly back on Ankara/Türkiye initial orientation
      gsap.to(earthGroupRef.current.rotation, {
        x: ANKARA_INITIAL_ROTATION_X,
        y: ANKARA_INITIAL_ROTATION_Y,
        duration: 1.4,
        ease: "power2.inOut",
      });
    }
  }, [selectedOffice, earthGroupRef]);

  // Initial setup: set rotation to Ankara directly on mount
  useEffect(() => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.x = ANKARA_INITIAL_ROTATION_X;
      earthGroupRef.current.rotation.y = ANKARA_INITIAL_ROTATION_Y;
    }
  }, [earthGroupRef]);

  // Slow auto rotation around Y axis ONLY when no city is selected
  useFrame((_, delta) => {
    if (earthGroupRef.current && isAutoRotating) {
      earthGroupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* 3D Photorealistic Earth Mesh */}
      <EarthMesh radius={radius} />

      {/* Gazi Red Curved Connection Arcs */}
      <GaziConnectingArcs offices={offices} radius={radius} />

      {/* Dynamic City Markers */}
      {offices.map((office) => (
        <GlobeMarker
          key={office.id}
          office={office}
          radius={radius}
          isSelected={selectedOffice?.id === office.id}
          onClick={onSelectOffice}
        />
      ))}
    </group>
  );
}

// Executive 3D Camera Fly-To Controller
function CameraController({ selectedOffice, earthGroupRef }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (!selectedOffice) {
      // Default view camera position focused on Turkey
      gsap.to(camera.position, {
        x: 0,
        y: 1.1,
        z: 5.6,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(0, 0, 0),
      });
      return;
    }

    // Dynamic 3D position calculation for selected office
    const localPinPos = latLngToVector3(selectedOffice.latitude, selectedOffice.longitude, 2);

    const worldPinPos = localPinPos.clone();
    if (earthGroupRef.current) {
      worldPinPos.applyEuler(earthGroupRef.current.rotation);
    }

    // Sleek camera flight distance
    const zoomDistance = 3.7;
    const targetCamPos = worldPinPos.clone().normalize().multiplyScalar(zoomDistance);

    gsap.to(camera.position, {
      x: targetCamPos.x,
      y: targetCamPos.y,
      z: targetCamPos.z,
      duration: 1.5,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
      },
    });
  }, [selectedOffice, camera, earthGroupRef]);

  return <OrbitControls ref={controlsRef} enablePan={false} minDistance={3} maxDistance={9} rotateSpeed={0.5} />;
}

export default function GlobeScene({ offices, selectedOffice, onSelectOffice }) {
  const earthGroupRef = useRef();

  return (
    <div className="relative z-0 w-full h-[440px] rounded-[1.5rem] overflow-hidden bg-gradient-to-b from-[#0b192c] via-[#1e293b] to-[#0f172a] border border-gray-200/50 shadow-inner">
      <Canvas camera={{ position: [0, 1.1, 5.6], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Soft Studio Lighting */}
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 4, 5]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-5, -4, -5]} intensity={1.2} color="#0066cc" />

          {/* Synchronized Earth, Beacons & Gazi Red Connecting Arcs */}
          <SynchronizedEarthGroup
            offices={offices}
            selectedOffice={selectedOffice}
            onSelectOffice={onSelectOffice}
            earthGroupRef={earthGroupRef}
          />

          {/* 3D Camera Fly-To Controller */}
          <CameraController selectedOffice={selectedOffice} earthGroupRef={earthGroupRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
