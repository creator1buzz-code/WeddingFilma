import Hero from "@/components/home/Hero";
import Portfolio from "@/components/home/Portfolio";
import FeaturedFilms from "@/components/home/FeaturedFilms";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";
import Services from "@/components/home/Services";
import FAQ from "@/components/home/FAQ";
import InstagramFeed from "@/components/home/InstagramFeed";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Portfolio />
      <FeaturedFilms />
      <Stats />
      <WhyChoose />
      <Services />
      <Testimonials />
      <FAQ />
      <InstagramFeed />
      <ContactCTA />
    </>
  );
}
