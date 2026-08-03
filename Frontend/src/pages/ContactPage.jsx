import { useEffect, useState } from "react";
import { getContactInfo } from "../api/endpoints";
import PageSection from "../components/common/PageSection";
import CampusTransportSection from "../components/contact/CampusTransportSection";
import GlobeContainer from "../features/globe/GlobeContainer";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    getContactInfo().then(setContactInfo).catch(() => setContactInfo(null));
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-[#f8fafc]">
      <PageSection className="!py-6">
        {/* 1. Ankara Yerleşkesi, Açık Adres & Harita */}
        <CampusTransportSection contactInfo={contactInfo} />

        {/* 2. React Three Fiber + Drei + GSAP Modüler 3D Dünya Küresi Simülasyonu */}
        <GlobeContainer />
      </PageSection>
    </div>
  );
}
