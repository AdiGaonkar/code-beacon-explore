
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Code, Eye } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-gradient pt-20 pb-32 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-black dark:bg-card shadow-lg p-3 rounded-full">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 grid place-items-center animate-float">
                <Search className="text-black" size={28} />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Discover Developer Projects With Source Code
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Explore a curated collection of developer projects, complete with source code, 
            to learn, get inspired, and build amazing things.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button className="btn-gradient px-8 py-6 text-lg">
                Explore Projects
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="px-8 py-6 text-lg border-primary text-primary hover:bg-primary/10">
                Share Your Project
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-black dark:bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 grid place-items-center mb-4">
              <Search className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Projects</h3>
            <p className="text-muted-foreground">
              Find projects that match your interests using powerful search filters.
            </p>
          </div>
          
          <div className="bg-black dark:bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 grid place-items-center mb-4">
              <Code className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Access Source Code</h3>
            <p className="text-muted-foreground">
              Get access to full source code to learn how things are built.
            </p>
          </div>
          
          <div className="bg-black dark:bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 grid place-items-center mb-4">
              <Eye className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Work</h3>
            <p className="text-muted-foreground">
              Showcase your projects and get feedback from the community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
