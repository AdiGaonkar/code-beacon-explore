
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import Footer from "@/components/Footer";
import { Search, Code, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StatsSection = () => (
  <section className="py-16 px-4 bg-white dark:bg-card border-y border-border">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24 text-center">
        <div>
          <p className="text-4xl font-bold text-searchifi-purple mb-2">2,500+</p>
          <p className="text-muted-foreground">Projects Available</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-searchifi-purple mb-2">15,000+</p>
          <p className="text-muted-foreground">Developers</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-searchifi-purple mb-2">50+</p>
          <p className="text-muted-foreground">Technologies</p>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">How Searchifi Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover, explore, and learn from projects with just a few clicks.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-searchifi-purple/10 grid place-items-center mx-auto mb-6">
            <Search className="text-searchifi-purple" size={24} />
          </div>
          <h3 className="text-xl font-medium mb-3">Search Projects</h3>
          <p className="text-muted-foreground">
            Find projects by technology, category, or keyword that match your interests.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-searchifi-purple/10 grid place-items-center mx-auto mb-6">
            <Code className="text-searchifi-purple" size={24} />
          </div>
          <h3 className="text-xl font-medium mb-3">Access Code</h3>
          <p className="text-muted-foreground">
            View source code, documentation, and demos to understand how things work.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-searchifi-purple/10 grid place-items-center mx-auto mb-6">
            <Github className="text-searchifi-purple" size={24} />
          </div>
          <h3 className="text-xl font-medium mb-3">Contribute</h3>
          <p className="text-muted-foreground">
            Share your own projects or contribute to existing ones to help others learn.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 px-4 bg-gradient-to-r from-searchifi-purple to-searchifi-light-purple text-white">
    <div className="container mx-auto text-center max-w-3xl">
      <h2 className="text-3xl font-bold mb-6">Ready to discover amazing projects?</h2>
      <p className="mb-8 text-white/80 text-lg">
        Join thousands of developers who are learning and sharing projects on Searchifi.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/register">
          <Button variant="secondary" size="lg" className="px-8">
            Create Account
          </Button>
        </Link>
        <Link to="/projects">
          <Button variant="outline" size="lg" className="px-8 text-white border-white hover:bg-white/10">
            Explore Projects
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturedProjects />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
