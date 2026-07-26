import HeroSlider from "../components/home/HeroSlider";
import NewsEventsSection from "../components/home/NewsEventsSection";
import StatsCounter from "../components/home/StatsCounter";
import BiggArea from "../components/home/BiggArea";

export default function HomePage() {
  return (
    <div className="space-y-4 pb-12">
      <HeroSlider />
      <NewsEventsSection />
      <StatsCounter />
      <BiggArea />
    </div>
  );
}
