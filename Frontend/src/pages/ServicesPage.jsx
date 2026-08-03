import React from "react";
import { servicesContent } from "../data/services-content";
import PageSection from "../components/common/PageSection";
import InteractiveHubSpoke from "../components/services/InteractiveHubSpoke";
import ServiceUnitDetail from "../components/services/ServiceUnitDetail";
import IncentivesSection from "../components/services/IncentivesSection";
import CampusFacilities from "../components/services/CampusFacilities";
import MembershipBadges from "../components/services/MembershipBadges";
import FaqTeaser from "../components/services/FaqTeaser";
import ServicesCallToAction from "../components/services/ServicesCallToAction";

export default function ServicesPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* İnteraktif Çekirdek (Hub & Spoke) Hizmet Alanı */}
      <PageSection className="!py-0">
        <InteractiveHubSpoke />
      </PageSection>

      {/* Detaylı Hizmetler Bölümü (Gazi TTO, Kuluçka vb.) */}
      <PageSection className="!py-4">
        <div className="text-center md:text-left mb-8 border-b border-gray-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">
            Hizmet Detayları
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
            Detaylı Faaliyet Alanlarımız
          </h2>
        </div>
        <div className="space-y-6">
          {servicesContent.units.map((unit) => (
            <ServiceUnitDetail
              key={unit.id}
              unit={unit}
            />
          ))}
        </div>
      </PageSection>

      {/* 5. Teşvikler / Yasal Avantajlar */}
      <PageSection className="py-4">
        <IncentivesSection incentives={servicesContent.incentives} />
      </PageSection>

      {/* 6. Kampüs İmkanları */}
      <PageSection className="py-6">
        <CampusFacilities
          facilities={servicesContent.facilities}
          facilityImages={servicesContent.facilityImages}
        />
      </PageSection>

      {/* 8. SSS Köprüsü */}
      <PageSection className="py-4">
        <FaqTeaser questions={servicesContent.faq} />
      </PageSection>

      {/* 7. Üyelikler / Kurumsal Güven Rozetleri */}
      <PageSection className="py-4">
        <MembershipBadges badges={servicesContent.badges} />
      </PageSection>

      {/* 9. Kapanış CTA */}
      <PageSection className="pt-4 pb-8">
        <ServicesCallToAction cta={servicesContent.cta} />
      </PageSection>
    </div>
  );
}

