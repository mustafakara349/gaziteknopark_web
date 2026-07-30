import HeroSlider from "../components/home/HeroSlider";
import NewsEventsSection from "../components/home/NewsEventsSection";
import StatsCounter from "../components/home/StatsCounter";
import BiggArea from "../components/home/BiggArea";
import SuccessStories from "../components/home/SuccessStories";
import CompaniesSection from "../components/home/CompaniesSection";
import TechnologiesSection from "../components/home/TechnologiesSection";
import NewsletterGallery from "../components/home/NewsletterGallery";

export default function HomePage() {
  return (
    <div className="pb-24">
      <HeroSlider />
      <NewsEventsSection />
      <StatsCounter />
      <BiggArea />
      <SuccessStories limit={10} layout="slider" />
      <CompaniesSection />
      <TechnologiesSection />
      <NewsletterGallery />
    </div>
  );
}
