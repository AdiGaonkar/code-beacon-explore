
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  tags: string[];
  image: string;
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="project-card flex flex-col h-full">
      <div className="h-40 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart size={14} className="text-searchifi-purple" />
            <span>{project.likes}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/80 text-xs">{tag}</Badge>
          ))}
          {project.tags.length > 2 && (
            <Badge variant="secondary" className="bg-secondary/50 text-xs">+{project.tags.length - 2}</Badge>
          )}
        </div>
        <div className="mt-auto text-right">
          <Link to={`/projects/${project.id}`}>
            <Button variant="ghost" size="sm" className="text-xs text-searchifi-purple hover:text-searchifi-purple hover:bg-searchifi-purple/10">
              View Project <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const RelatedProjects = ({ currentProjectId, tags }: { currentProjectId: string, tags: string[] }) => {
  // Mock data - in a real app, this would be fetched from an API
  const relatedProjects = [
    {
      id: "3",
      title: "E-commerce Store",
      description: "Full-featured online store with cart and payment processing",
      author: "Alex Thompson",
      likes: 312,
      tags: ["Next.js", "Stripe", "MongoDB"],
      image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "4",
      title: "Portfolio Website",
      description: "Modern portfolio website with animations and dark mode",
      author: "Chris Davis",
      likes: 178,
      tags: ["React", "Three.js", "GSAP"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "5",
      title: "Recipe Finder App",
      description: "Search for recipes based on ingredients you have at home",
      author: "Sarah Miller",
      likes: 257,
      tags: ["Vue", "API", "Vuex"],
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
  ].filter(project => project.id !== currentProjectId);

  // Get only the first 3 related projects
  const displayProjects = relatedProjects.slice(0, 3);

  return (
    <div className="mt-12 pb-6">
      <h2 className="text-2xl font-semibold mb-6">Related Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;
