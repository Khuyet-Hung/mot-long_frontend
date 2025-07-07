import { useState } from "react";
import { About } from "../components/home/About";
import { Activities } from "../components/home/Activities";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Hero } from "../components/home/Hero";

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
        <About />
        <Activities />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
