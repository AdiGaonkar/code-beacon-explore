
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedProjects from "@/components/RelatedProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Github, ExternalLink, Download, Heart, Share, Save, Monitor } from "lucide-react";
import { 
  getProjects, 
  formatDate, 
  toggleLikeProject,
  toggleSaveProject,
  isProjectLiked,
  isProjectSaved,
  shareProject,
  getDownloadUrl,
  Project
} from "@/utils/projectUtils";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  
  // Check if the current user is the project owner
  const isOwner = user && project && user.id === project.authorId;

  useEffect(() => {
    // Fetch the project data
    const fetchProject = () => {
      setLoading(true);
      const projects = getProjects();
      const foundProject = projects.find(p => p.id === id);
      
      // Simulate API delay
      setTimeout(() => {
        setProject(foundProject || null);
        setLoading(false);
        
        // Check if the project is liked or saved by the user
        if (user && foundProject) {
          setLiked(isProjectLiked(user.id, foundProject.id));
          setSaved(isProjectSaved(user.id, foundProject.id));
        }
      }, 500);
    };

    fetchProject();
  }, [id, user]);

  const handleLikeToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like projects",
      });
      return;
    }
    
    if (project) {
      const newLikedState = toggleLikeProject(user.id, project.id);
      setLiked(newLikedState);
      
      // Update the project's like count in state
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: newLikedState ? prev.likes + 1 : Math.max(0, prev.likes - 1)
        };
      });
    }
  };

  const handleSaveToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save projects",
      });
      return;
    }
    
    if (project) {
      const newSavedState = toggleSaveProject(user.id, project.id);
      setSaved(newSavedState);
    }
  };

  const handleShare = () => {
    if (project) {
      shareProject(project);
    }
  };

  const handleDownload = () => {
    if (!project) return;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = getDownloadUrl(project);
    link.download = project.fileName || `${project.title.toLowerCase().replace(/\s+/g, '-')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your download has started",
    });
  };

  const toggleLiveDemo = () => {
    setShowLiveDemo(prev => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-searchifi-purple border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p>Loading project details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link to="/projects">
              <Button>
                <ArrowLeft className="mr-2" size={16} />
                Back to Projects
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
          
          {/* Hero section with project image */}
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-primary/90">
                <span>By {project.author}</span>
                <span className="mx-2">•</span>
                <span>Uploaded on {formatDate(project.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Project header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className={`gap-2 ${liked ? 'text-rose-500 border-rose-500 hover:bg-rose-500/10' : ''}`}
                  onClick={handleLikeToggle}
                >
                  <Heart size={18} className={liked ? 'fill-rose-500' : ''} />
                  <span>{project.likes}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className={`gap-2 ${saved ? 'text-primary border-primary hover:bg-primary/10' : ''}`}
                  onClick={handleSaveToggle}
                >
                  <Save size={18} className={saved ? 'fill-primary' : ''} />
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share size={18} />
                  <span>Share</span>
                </Button>
                <Button 
                  variant={showLiveDemo ? "default" : "outline"}
                  className="gap-2"
                  onClick={toggleLiveDemo}
                >
                  <Monitor size={18} />
                  <span>Live Demo</span>
                </Button>
              </div>
            </div>
            
            {/* Live Demo Screen */}
            {showLiveDemo && (
              <Card className="mb-8 overflow-hidden">
                <CardContent className="p-0 h-[500px] relative">
                  {project.demoUrl ? (
                    <iframe 
                      src={project.demoUrl} 
                      title={`${project.title} Live Demo`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <div className="text-center p-8">
                        <Monitor size={48} className="mx-auto mb-4 text-primary/50" />
                        <h3 className="text-xl font-medium mb-2 text-primary">No Live Demo Available</h3>
                        <p className="text-muted-foreground max-w-md">
                          The author hasn't provided a live demo URL for this project.
                        </p>
                      </div>
                    </div>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 bg-black/70 border-border hover:bg-black/90"
                    onClick={toggleLiveDemo}
                  >
                    Close Demo
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Links Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Links</h2>
                  <div className="space-y-4">
                    {/* Only show GitHub repo if the user is the owner or it's public */}
                    {(isOwner || !project.repoUrl) && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Github size={18} />
                          <span>GitHub Repository</span>
                        </div>
                        {project.repoUrl && (
                          <a 
                            href={project.repoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit Repo
                          </a>
                        )}
                      </div>
                    )}
                    
                    {project.demoUrl && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ExternalLink size={18} />
                          <span>Live Demo</span>
                        </div>
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Demo
                        </a>
                      </div>
                    )}
                    
                    {/* Only show Download option for project owner */}
                    {isOwner && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Download size={18} />
                          <span>Download ZIP</span>
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={handleDownload}
                        >
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Details Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">{project.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded:</span>
                      <span className="font-medium">{formatDate(project.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author:</span>
                      <span className="font-medium">{project.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Likes:</span>
                      <span className="font-medium">{project.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Related Projects Section */}
          <RelatedProjects currentProjectId={project.id} tags={project.tags} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;
