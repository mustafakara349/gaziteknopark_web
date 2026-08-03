import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const OFFICES = [
  {
    id: "ankara",
    city: "Ankara",
    country: "Türkiye",
    title: "Gazi Teknopark Genel Merkez",
    badge: "Genel Merkez & Ar-Ge Kampüsü",
    flag: "🇹🇷",
    address: "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA",
    email: "info@gaziteknopark.com.tr",
    lat: 39.9334,
    lng: 32.8597,
  },
  {
    id: "london",
    city: "Londra",
    country: "İngiltere",
    title: "Londra İrtibat & Hızlandırma Ofisi",
    badge: "Avrupa İrtibat Ofisi",
    flag: "🇬🇧",
    address: "London Tech Hub, 100 Bishopsgate, EC2N 4AG, London / UNITED KINGDOM",
    email: "london@gaziteknopark.com.tr",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "Birleşik Arap Emirlikleri",
    title: "Dubai Teknoloji & Ticaret Ofisi",
    badge: "Orta Doğu İrtibat Ofisi",
    flag: "🇦🇪",
    address: "Dubai Future District, DIFC Gate Precinct 4, Level 5, Dubai / UAE",
    email: "dubai@gaziteknopark.com.tr",
    lat: 25.2048,
    lng: 55.2708,
  },
];

// Convert Lat/Lng to 3D Cartesian vector on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function GlobalOfficesGlobe() {
  const [selectedOffice, setSelectedOffice] = useState("ankara");
  const [isZoomed, setIsZoomed] = useState(true);
  const [copied, setCopied] = useState(false);

  const mountRef = useRef(null);
  const globeGroupRef = useRef(null);
  const cameraRef = useRef(null);

  const current = OFFICES.find((o) => o.id === selectedOffice) || OFFICES[0];

  // Smooth Camera Zoom & Rotate to selected office location
  useEffect(() => {
    if (!globeGroupRef.current || !cameraRef.current) return;

    const targetLngRad = -((current.lng + 90) * (Math.PI / 180));
    const targetLatRad = (current.lat * 0.45 * Math.PI) / 180;
    const targetZoom = isZoomed ? 3.3 : 5.2; // Zoomed In vs Full World View

    let step = 0;
    const startY = globeGroupRef.current.rotation.y;
    const startX = globeGroupRef.current.rotation.x;
    const startZ = cameraRef.current.position.z;

    const animateToTarget = () => {
      step += 0.05;
      if (step <= 1) {
        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.y = startY + (targetLngRad - startY) * step;
          globeGroupRef.current.rotation.x = startX + (targetLatRad - startX) * step;
        }
        if (cameraRef.current) {
          cameraRef.current.position.z = startZ + (targetZoom - startZ) * step;
        }
        requestAnimationFrame(animateToTarget);
      } else {
        if (globeGroupRef.current) {
          globeGroupRef.current.rotation.y = targetLngRad;
          globeGroupRef.current.rotation.x = targetLatRad;
        }
        if (cameraRef.current) {
          cameraRef.current.position.z = targetZoom;
        }
      }
    };
    animateToTarget();
  }, [selectedOffice, isZoomed]);

  // Three.js 3D Engine Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = 440;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.3; // Default Zoomed In
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x0066cc, 2.5);
    dirLight.position.set(5, 4, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x082b5c, 1.5);
    backLight.position.set(-5, -4, -5);
    scene.add(backLight);

    // 3. Globe Parent Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const radius = 1.8;

    // 3A. Translucent Globe Sphere (Corporate Blue)
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x082b5c,
      emissive: 0x051d40,
      specular: 0x0066cc,
      shininess: 35,
      transparent: true,
      opacity: 0.9,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 3B. Latitude & Longitude Grid Overlay
    const wireframeGeo = new THREE.SphereGeometry(radius + 0.005, 36, 18);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x2b6cb0,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // 3C. Dot Matrix Landmass Particles
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const lat = (Math.random() - 0.5) * 160;
      const lng = (Math.random() - 0.5) * 360;
      const v = latLngToVector3(lat, lng, radius + 0.015);
      particlePos[i * 3] = v.x;
      particlePos[i * 3 + 1] = v.y;
      particlePos[i * 3 + 2] = v.z;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x63b3ed,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particlePoints);

    // 3D Office Location Pins & Connecting Red Curved Lines
    const ankaraVec = latLngToVector3(OFFICES[0].lat, OFFICES[0].lng, radius + 0.04);

    OFFICES.forEach((office) => {
      const pos = latLngToVector3(office.lat, office.lng, radius + 0.04);

      // Red Glowing Pin Mesh
      const pinGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xe30613 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      // Curved Red Lines in 3D Space
      if (office.id !== "ankara") {
        const midPoint = new THREE.Vector3().addVectors(ankaraVec, pos).multiplyScalar(0.5);
        midPoint.normalize().multiplyScalar(radius + 0.45);

        const curve = new THREE.QuadraticBezierCurve3(ankaraVec, midPoint, pos);
        const points = curve.getPoints(40);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineDashedMaterial({
          color: 0xe30613,
          dashSize: 0.08,
          gapSize: 0.04,
          linewidth: 2,
        });
        const curveLine = new THREE.Line(curveGeo, curveMat);
        curveLine.computeLineDistances();
        globeGroup.add(curveLine);
      }
    });

    // 4. Mouse Drag Rotation Logic
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !globeGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 5. Render Loop
    let animId;
    const animate = () => {
      if (!isDragging && globeGroup) {
        // Slow rotation when idle
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  const handleCopyAddress = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Uluslararası İrtibat Ağı</span>
          <h2 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">3D Dünya Küresi & İrtibat Ofislerimiz</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
            Raptiyelere veya sekmelere tıkladığınızda harita o coğrafyaya otomatik yakınlaşır ve iletişim bilgileri harita üzerinde görüntülenir.
          </p>
        </div>

        {/* Location Selection & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed((z) => !z)}
            className="rounded-full bg-surface border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {isZoomed ? "🔍 Görünümü Uzaklaştır" : "🔎 Yakınlaş (Zoom)"}
          </button>

          <div className="flex gap-1.5 bg-surface p-1 rounded-full border border-gray-100">
            {OFFICES.map((office) => {
              const isActive = office.id === selectedOffice;
              return (
                <button
                  key={office.id}
                  type="button"
                  onClick={() => {
                    setSelectedOffice(office.id);
                    setIsZoomed(true);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive ? "bg-primary text-white shadow-xs" : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <span>{office.flag}</span>
                  <span>{office.city}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3D Map Viewport with Floating Interactive Callout Card Overlay */}
      <div className="mt-8 relative overflow-hidden rounded-3xl border border-gray-200/80 bg-[#f4f7fc] p-4 min-h-[460px] flex items-center justify-center">
        {/* Three.js 3D Canvas */}
        <div ref={mountRef} className="w-full h-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing" />

        {/* 🌟 FLOATING INTERACTIVE POPUP CARD OVERLAY DIRECTLY ON MAP VIEWPORT 🌟 */}
        <div className="absolute bottom-6 right-6 max-w-sm rounded-2xl border border-primary/20 bg-white/95 backdrop-blur-md p-5 shadow-xl transition-all duration-300 animate-slide-down">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
              {current.flag} {current.country}
            </span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
              {current.badge}
            </span>
          </div>

          <h3 className="mt-2 text-base font-extrabold text-primary">{current.title}</h3>
          <p className="mt-0.5 text-[11px] font-mono text-gray-400">
            Koordinat: {current.lat}° N, {current.lng}° E
          </p>

          <div className="mt-3 space-y-2 border-t border-gray-100 pt-2 text-xs">
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Açık Adres</span>
              <p className="mt-0.5 font-medium text-ink leading-relaxed">{current.address}</p>
            </div>

            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">E-Posta</span>
              <p className="mt-0.5 font-bold text-primary">{current.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopyAddress(current.address)}
            className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
          >
            {copied ? <span>✓ Adres Kopyalandı</span> : <span>Adresi Kopyala</span>}
          </button>
        </div>

        {/* Top Hint Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] text-primary bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200/80 shadow-xs pointer-events-none">
          <span className="flex items-center gap-2 font-bold">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>3D Canlı Harita Odaklanma & Zoom Modu</span>
          </span>
          <span className="text-gray-500 font-medium">Raptiyelere / Sekmelere Tıklayarak Yakınlaşabilirsiniz</span>
        </div>
      </div>
    </div>
  );
}
