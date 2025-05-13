
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock data for default featured projects
const defaultFeaturedProjects = [
  {
    id: 1,
    title: "React Task Manager",
    description: "A beautiful task management application built with React and Firebase",
    author: "Jane Smith",
    likes: 234,
    tags: ["React", "Firebase", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    title: "Weather Dashboard",
    description: "Real-time weather application with beautiful visualizations",
    author: "Mike Johnson",
    likes: 186,
    tags: ["React", "API", "Chart.js"],
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    title: "E-commerce Store",
    description: "Full-featured online store with cart and payment processing",
    author: "Alex Thompson",
    likes: 312,
    tags: ["Next.js", "Stripe", "MongoDB"],
    image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  }
];

const ProjectCard = ({ project, onLikeToggle, isLiked }: { project: any; onLikeToggle: (id: number | string) => void; isLiked: boolean }) => {
  return (
    <div className="project-card flex flex-col h-full bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onLikeToggle(project.id);
            }}
            className="flex items-center gap-1 text-sm hover:scale-110 transition-transform"
          >
            <Heart 
              size={18} 
              className={isLiked ? "fill-searchifi-purple text-searchifi-purple" : "text-muted-foreground"} 
            />
            <span>{project.likes + (isLiked ? 1 : 0)}</span>
          </button>
        </div>
        <p className="text-muted-foreground mb-4 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags && project.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="bg-secondary/80">{tag}</Badge>
          ))}
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-muted-foreground">By {project.author}</span>
          <Link to={`/projects/${project.id}`}>
            <Button variant="ghost" size="sm" className="text-searchifi-purple hover:text-searchifi-purple hover:bg-searchifi-purple/10">
              View Project <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedProjects = () => {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(defaultFeaturedProjects);
  const [likedProjects, setLikedProjects] = useState<(number | string)[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Get user submitted projects from localStorage
    const userProjects = JSON.parse(localStorage.getItem('searchifi_projects') || '[]');
    
    // If there are user projects, prioritize displaying them
    if (userProjects && userProjects.length > 0) {
      // Sort by creation date (most recent first)
      const sortedProjects = [...userProjects].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Take the most recent user projects (up to 3)
      const recentUserProjects = sortedProjects.slice(0, 3);
      
      // Fill the remaining slots with default projects if needed
      const remainingCount = 3 - recentUserProjects.length;
      const displayProjects = recentUserProjects.concat(
        remainingCount > 0 ? defaultFeaturedProjects.slice(0, remainingCount) : []
      );
      
      setFeaturedProjects(displayProjects);
    }

    // Load liked projects from localStorage
    const savedLikedProjects = localStorage.getItem('searchifi_liked_projects');
    if (savedLikedProjects) {
      setLikedProjects(JSON.parse(savedLikedProjects));
    }
  }, []);

  const handleLikeToggle = (projectId: number | string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like projects",
        variant: "destructive",
      });
      return;
    }

    setLikedProjects(prev => {
      const isAlreadyLiked = prev.includes(projectId);
      let newLikedProjects;
      
      if (isAlreadyLiked) {
        // Unlike the project
        newLikedProjects = prev.filter(id => id !== projectId);
        toast({
          description: "Project removed from your likes",
        });
      } else {
        // Like the project
        newLikedProjects = [...prev, projectId];
        toast({
          description: "Project added to your likes",
        });
      }
      
      // Save to localStorage
      localStorage.setItem('searchifi_liked_projects', JSON.stringify(newLikedProjects));
      return newLikedProjects;
    });
  };

  return (
    <section className="py-20 px-4 bg-secondary/30 dark:bg-secondary/10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover some of the best projects on Searchifi that developers love.
            </p>
          </div>
          <Link to="/projects">
            <Button variant="outline" className="border-searchifi-purple text-searchifi-purple hover:bg-searchifi-purple/10">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onLikeToggle={handleLikeToggle}
              isLiked={likedProjects.includes(project.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
