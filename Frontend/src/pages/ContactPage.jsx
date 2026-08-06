import { useEffect, useState } from "react";
import { getContactInfo } from "../api/endpoints";
import CampusTransportSection from "../components/contact/CampusTransportSection";
import GlobeContainer from "../features/globe/GlobeContainer";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    getContactInfo().then(setContactInfo).catch(() => setContactInfo(null));
  }, []);

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-8">
        {/* 1. Ankara Yerleşkesi, Adres & Harita (Mevzuat/Duyurular tipografisinde, telefonsuz & emojisiz) */}
        <CampusTransportSection contactInfo={contactInfo} />

        {/* 2. 3D Dünya Küresi Simülasyonu (Emojiler ve telefonlar temizlenmiş) */}
        <GlobeContainer />
      </div>
    </div>
  );
}
