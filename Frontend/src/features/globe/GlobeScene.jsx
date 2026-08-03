import { useRef, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import EarthMesh from "./EarthMesh";
import GlobeMarker from "./GlobeMarker";

// Exact Lat/Lng to 3D Cartesian coordinates on sphere
export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Red 3D Curved Connection Lines
function RedConnectingArcs({ offices, radius = 2 }) {
  if (!offices || offices.length < 2) return null;

  const ankara = offices.find((o) => o.id === "ankara") || offices[0];
  const pAnkara = latLngToVector3(ankara.latitude, ankara.longitude, radius + 0.04);

  const curves = offices
    .filter((o) => o.id !== ankara.id)
    .map((dest) => {
      const pDest = latLngToVector3(dest.latitude, dest.longitude, radius + 0.04);
      const midPoint = new THREE.Vector3().addVectors(pAnkara, pDest).multiplyScalar(0.5);
      midPoint.normalize().multiplyScalar(radius + 0.42);

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
              dashSize={0.08}
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

// Synchronized Earth Group with Northern Hemisphere Default Pitch
function SynchronizedEarthGroup({ offices, selectedOffice, onSelectOffice, earthGroupRef }) {
  const radius = 2;
  const isAutoRotating = !selectedOffice;

  useEffect(() => {
    if (!earthGroupRef.current) return;
    if (!selectedOffice) {
      gsap.to(earthGroupRef.current.rotation, {
        x: 0.3,
        duration: 1.2,
        ease: "power2.out",
      });
    }
  }, [selectedOffice, earthGroupRef]);

  // Slow auto rotation around Y axis ONLY when no city is selected
  useFrame((_, delta) => {
    if (earthGroupRef.current && isAutoRotating) {
      earthGroupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* 3D Photorealistic Earth Mesh */}
      <EarthMesh radius={radius} />

      {/* Red 3D Curved Connection Lines */}
      <RedConnectingArcs offices={offices} radius={radius} />

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
      // Default view: Northern Hemisphere emphasis camera position [0, 1.2, 5.8]
      gsap.to(camera.position, {
        x: 0,
        y: 1.2,
        z: 5.8,
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

    // Sleek camera flight distance (3.8 for executive horizon view)
    const zoomDistance = 3.8;
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
    <div className="relative z-0 w-full h-[440px] rounded-2xl overflow-hidden bg-[#051d40] border border-gray-200/40 shadow-inner">
      <Canvas camera={{ position: [0, 1.2, 5.8], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Starfield Space Background */}
          <Stars radius={100} depth={50} count={2500} factor={3.5} saturation={0} fade speed={1} />

          {/* Lights */}
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 4, 5]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-5, -4, -5]} intensity={1} color="#082b5c" />

          {/* Synchronized Earth, Pushpins & Red 3D Connecting Lines */}
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
