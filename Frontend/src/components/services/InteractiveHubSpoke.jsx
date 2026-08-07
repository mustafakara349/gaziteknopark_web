import React, { useState } from "react";
import * as LucideIcons from "lucide-react";

export default function InteractiveHubSpoke() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isCenterHovered, setIsCenterHovered] = useState(false);

  // 8 Hizmet Maddesi (1200 x 600 SVG Koordinat Alanı)
  const services = [
    {
      index: 0,
      title: "Dünya Kalitesinde Etkin Teknopark Hizmetleri",
      icon: "Globe",
      side: "left",
      lineX: 350,
      lineY: 120,
      cardX: 80,  // lineX - 270 (Kart Genişliği)
      cardY: 83,  // lineY - 37 (Kart Yüksekliği / 2)
      curveC: "470 300, 420 120, 350 120", // Smooth Cubic Bezier S-Curve
    },
    {
      index: 1,
      title: "Nitelikli Ofis, Altyapı ve İdari Destek Hizmetleri",
      icon: "Building",
      side: "left",
      lineX: 300,
      lineY: 240,
      cardX: 30,
      cardY: 203,
      curveC: "470 300, 400 240, 300 240",
    },
    {
      index: 2,
      title: "Firma Tanıtım ve Pazarlama Destek Hizmetleri",
      icon: "Megaphone",
      side: "left",
      lineX: 300,
      lineY: 360,
      cardX: 30,
      cardY: 323,
      curveC: "470 300, 400 360, 300 360",
    },
    {
      index: 3,
      title: "İş Birliği Destekleri",
      icon: "Handshake",
      side: "left",
      lineX: 350,
      lineY: 480,
      cardX: 80,
      cardY: 443,
      curveC: "470 300, 420 480, 350 480",
    },
    {
      index: 4,
      title: "Danışmanlık Hizmetleri",
      icon: "FileText",
      side: "right",
      lineX: 850,
      lineY: 120,
      cardX: 850, // Sağ taraftaki kartların başlangıç noktası lineX'tir
      cardY: 83,
      curveC: "730 300, 780 120, 850 120",
    },
    {
      index: 5,
      title: "Mentorluk Desteği",
      icon: "Compass",
      side: "right",
      lineX: 900,
      lineY: 240,
      cardX: 900,
      cardY: 203,
      curveC: "730 300, 800 240, 900 240",
    },
    {
      index: 6,
      title: "Eğitim, Konferans, Bilgilendirme ve Seminer Hizmetleri",
      icon: "GraduationCap",
      side: "right",
      lineX: 900,
      lineY: 360,
      cardX: 900,
      cardY: 323,
      curveC: "730 300, 800 360, 900 360",
    },
    {
      index: 7,
      title: "Sosyal Etkinlikler",
      icon: "Sparkles",
      side: "right",
      lineX: 850,
      lineY: 480,
      cardX: 850,
      cardY: 443,
      curveC: "730 300, 780 480, 850 480",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden py-4 bg-radial-grid">
      {/* Özel CSS Efektleri ve Animasyonlar */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.35)) drop-shadow(0 0 15px rgba(59, 130, 246, 0.15));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.65)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.35));
          }
        }
        @keyframes flowLaser {
          from {
            stroke-dashoffset: 350;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }
        .svg-guide-line {
          stroke-opacity: 0.6; /* Daha belirgin hale getirildi (eski: 0.25) */
        }
        .svg-pulse-active {
          stroke-dasharray: 60, 220;
          animation: flowLaser 1.0s linear infinite; /* Sabit akış hızı için timing function: linear */
        }
        .svg-pulse-idle {
          stroke-dasharray: 8, 48;
          animation: flowLaser 8s linear infinite;
        }
        .bg-radial-grid {
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.02) 40%, transparent 70%);
        }
      `}</style>

      {/* ========================================================================= */}
      {/* DESKTOP/TABLET TUVALİ (Kusursuz foreignObject Entegrasyonu) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full aspect-[16/8]">

        {/* Tüm Yapıyı İçeren Tek SVG Tuvali */}
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full overflow-visible z-10"
        >
          <defs>
            <filter id="neon-glow-spoke" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Faint Blue Gradyanı (Daha belirgin ve renkli) */}
            <linearGradient id="line-gradient-idle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#082b5c" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0066cc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>

            {/* Neon Çizgi Gradyanı (Aktif durum için daha parlak) */}
            <linearGradient id="line-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0066cc" stopOpacity="1.0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1.0" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
            </linearGradient>

            {/* Laser Işık Topu Degradesi */}
            <linearGradient id="laser-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="65%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            {/* Merkez Çekirdek Arkası Glow Degradesi (Clipping olmaması için) */}
            <radialGradient id="center-glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0066cc" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#082b5c" stopOpacity="0.12" />
              <stop offset="80%" stopColor="#e30613" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Çizgiler ve Eklem Noktaları */}
          {services.map((svc) => {
            const isHovered = hoveredIndex === svc.index;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <g key={svc.index}>
                {/* 1. Kavisli Sabit Neon Çizgi (S-Curve) - strokeOpacity ile daha belirgin */}
                <path
                  d={`M 600 300 C ${svc.curveC}`}
                  fill="none"
                  stroke={isHovered ? "url(#line-gradient-active)" : "url(#line-gradient-idle)"}
                  strokeWidth={isHovered ? "4.5" : "3"}
                  className="svg-guide-line transition-all duration-300"
                  strokeOpacity={isHovered ? 1.0 : 0.65}
                  opacity={isAnyHovered && !isHovered ? 0.15 : 1.0}
                />

                {/* 2. Aktif Sabit Hızlı Enerji Akışı - Daha yüksek görünürlük */}
                <path
                  d={`M 600 300 C ${svc.curveC}`}
                  fill="none"
                  stroke="url(#laser-gradient)"
                  strokeWidth={isHovered ? "6.5" : "3"}
                  className={`transition-all duration-300 ${isHovered ? "svg-pulse-active" : "svg-pulse-idle"
                    }`}
                  filter={isHovered ? "url(#neon-glow-spoke)" : ""}
                  strokeOpacity={isHovered ? 1.0 : 0.6}
                  opacity={isHovered ? 1 : isAnyHovered ? 0.02 : 0.45}
                />

                {/* 3. Eklem / Snap Bağlantı Noktaları - Mavi tonlarında daha renkli */}
                <circle
                  cx={svc.lineX}
                  cy={svc.lineY}
                  r={isHovered ? "5.5" : "4"}
                  fill={isHovered ? "#3b82f6" : "#60a5fa"}
                  className="transition-all duration-300"
                  opacity={isAnyHovered && !isHovered ? 0.2 : 0.95}
                />
              </g>
            );
          })}

          {/* Merkez Çekirdek Arkası Glow (Native SVG Circle ile clipping/kenar sorunu olmadan) */}
          <circle
            cx="600"
            cy="300"
            r={isCenterHovered ? "145" : "115"}
            fill="url(#center-glow-gradient)"
            className="transition-all duration-500 ease-out pointer-events-none"
            opacity={isCenterHovered ? "1.0" : "0.75"}
          />

          {/* 1. Merkez Çekirdek (Hover ve Temaya Uygun Renkli/Glowlu Gölgelendirmeli) */}
          <foreignObject
            x="490"
            y="190"
            width="220"
            height="220"
            className="overflow-visible"
          >
            <div
              onMouseEnter={() => setIsCenterHovered(true)}
              onMouseLeave={() => setIsCenterHovered(false)}
              className={`relative flex h-full w-full items-center justify-center rounded-full bg-white border border-blue-100/50 shadow-sm transition-all duration-500 ease-out cursor-pointer ${isCenterHovered
                ? "scale-105 border-blue-400/50 shadow-md"
                : "scale-100 shadow-[0_0_30px_rgba(8,43,92,0.08)]"
                }`}
            >
              {/* Dış Halka 1 (Dönen Halka - Daha Belirgin ve Renkli) */}
              <div
                className={`absolute inset-[-14px] rounded-full border border-dashed pointer-events-none transition-all duration-700 ${isCenterHovered
                  ? "border-blue-400/50 animate-[spin_10s_linear_infinite] scale-105"
                  : "border-blue-400/30 animate-[spin_60s_linear_infinite] scale-100"
                  }`}
              />

              {/* Dış Halka 2 (Neon Pulsing Halka - Daha Belirgin ve Hafif Mavi Dolgulu) */}
              <div
                className={`absolute inset-[-7px] rounded-full border border-blue-400/40 bg-blue-500/5 animate-pulse-glow transition-all duration-300 ${isCenterHovered || hoveredIndex !== null ? "scale-105 opacity-100" : "scale-100 opacity-80"
                  }`}
              />

              <div className="absolute inset-1.5 rounded-full bg-white border border-gray-50 flex items-center justify-center p-4 shadow-inner">
                <img
                  src="/gazi_logo.png"
                  alt="Gazi Teknopark Logo"
                  className="h-32 w-32 object-contain rounded-full"
                />
              </div>
            </div>
          </foreignObject>

          {/* 2. Hizmet Kapsülleri */}
          {services.map((svc) => {
            const Icon = LucideIcons[svc.icon] || LucideIcons.HelpCircle;
            const isHovered = hoveredIndex === svc.index;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <foreignObject
                key={svc.index}
                x={svc.cardX}
                y={svc.cardY}
                width="270"
                height="74"
                className="overflow-visible"
              >
                <div
                  onMouseEnter={() => setHoveredIndex(svc.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full h-full select-none cursor-pointer transition-all duration-300 ease-in-out ${isHovered
                    ? "scale-[1.03] border-blue-400/80 bg-white/95 shadow-[0_12px_24px_rgba(59,130,246,0.15),0_0_12px_rgba(59,130,246,0.08)]"
                    : isAnyHovered
                      ? "opacity-40 scale-95 border-gray-100/20 bg-white/30"
                      : "border-blue-100/80 bg-white/90 shadow-[0_4px_12px_rgba(8,43,92,0.04)]"
                    } border rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-md`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${isHovered
                      ? "bg-primary text-white scale-110 rotate-3"
                      : "bg-blue-50/80 text-primary border border-blue-100/30"
                      }`}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <span
                    className={`text-xs font-bold leading-normal transition-colors duration-300 ${isHovered ? "text-primary font-extrabold" : "text-primary/90"
                      }`}
                  >
                    {svc.title}
                  </span>
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* MOBİL VE TABLET DÜZENİ */}
      {/* ========================================================================= */}
      <div className="lg:hidden block px-4 max-w-md mx-auto space-y-6 relative">
        <div className="flex flex-col items-center justify-center relative">
          {/* Geniş Alana Yayılmış Neon Işıldama (Mobil için daha yumuşak ve kenarları belirsiz) */}
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-[#0066cc]/10 to-[#e30613]/5 blur-[25px] pointer-events-none" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white border border-blue-100/50 shadow-[0_0_20px_rgba(8,43,92,0.08)]">
            <div className="absolute inset-[-2px] rounded-full border border-blue-400/30 animate-pulse-glow" />
            <img
              src="/gazi_logo.png"
              alt="Gazi Teknopark Logo"
              className="h-18 w-18 object-contain rounded-full"
            />
          </div>
        </div>

        <div className="relative pl-6 space-y-4">
          <div className="absolute left-3.5 top-0 bottom-6 w-[2.5px] bg-gradient-to-b from-blue-500 via-blue-300 to-indigo-100" />

          {services.map((svc) => {
            const Icon = LucideIcons[svc.icon] || LucideIcons.HelpCircle;
            const isHovered = hoveredIndex === svc.index;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={svc.index}
                onTouchStart={() => setHoveredIndex(svc.index)}
                onMouseEnter={() => setHoveredIndex(svc.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative flex items-center gap-3 border rounded-2xl p-4 transition-all duration-300 cursor-pointer ${isHovered
                  ? "border-blue-300 bg-white translate-x-1 shadow-md"
                  : isAnyHovered
                    ? "opacity-50 border-gray-100 bg-white/40"
                    : "border-blue-100/80 bg-white/90 shadow-sm"
                  }`}
              >
                <div
                  className={`absolute -left-2.5 h-[2px] w-2.5 transition-colors duration-300 ${isHovered ? "bg-blue-500" : "bg-blue-300/60"
                    }`}
                />
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${isHovered 
                    ? "bg-primary text-white scale-105" 
                    : "bg-blue-50/80 text-primary border border-blue-100/30"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-primary leading-normal">
                  {svc.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
