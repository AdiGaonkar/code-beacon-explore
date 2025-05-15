
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Copy, Heart, Share } from "lucide-react";
import { formatDate } from "@/utils/projectUtils";

interface Component {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  sourceCode: string;
  image: string;
  likes: number;
  createdAt: string;
}

const CodePreview = ({ code }: { code: string }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast({
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="relative border border-border rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-secondary/20 px-4 py-2 border-b border-border">
        <span className="text-sm font-medium">Source Code</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="h-8 flex gap-1 items-center text-xs"
        >
          <Copy size={14} />
          Copy
        </Button>
      </div>
      <pre className="bg-card p-4 overflow-auto max-h-[500px] text-sm">
        <code className="language-jsx">{code}</code>
      </pre>
    </div>
  );
};

const ComponentDetailsPage = () => {
  const { id } = useParams();
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchComponent = () => {
      setLoading(true);
      const components = JSON.parse(localStorage.getItem('searchifi_components') || '[]');
      const foundComponent = components.find((c: Component) => c.id === id);
      
      setTimeout(() => {
        setComponent(foundComponent || null);
        setLoading(false);
        
        // Check if the component is liked by the user
        if (user && foundComponent) {
          const likedComponents = JSON.parse(localStorage.getItem('searchifi_liked_components') || '[]');
          setLiked(likedComponents.includes(foundComponent.id));
        }
      }, 500);
    };

    fetchComponent();
  }, [id, user]);

  const handleLikeToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like components",
      });
      return;
    }
    
    if (component) {
      // Toggle like status
      const likedComponents = JSON.parse(localStorage.getItem('searchifi_liked_components') || '[]');
      const isAlreadyLiked = likedComponents.includes(component.id);
      
      let newLikedComponents;
      if (isAlreadyLiked) {
        newLikedComponents = likedComponents.filter((id: string) => id !== component.id);
      } else {
        newLikedComponents = [...likedComponents, component.id];
      }
      
      localStorage.setItem('searchifi_liked_components', JSON.stringify(newLikedComponents));
      setLiked(!isAlreadyLiked);
      
      // Update the component's like count
      const components = JSON.parse(localStorage.getItem('searchifi_components') || '[]');
      const updatedComponents = components.map((c: Component) => {
        if (c.id === component.id) {
          return {
            ...c,
            likes: isAlreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1
          };
        }
        return c;
      });
      
      localStorage.setItem('searchifi_components', JSON.stringify(updatedComponents));
      
      // Update the component in state
      setComponent(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: isAlreadyLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
        };
      });
    }
  };

  const handleShare = () => {
    if (component) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Component link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-searchifi-purple border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p>Loading component...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Component Not Found</h2>
            <p className="mb-8">The component you're looking for doesn't exist or has been removed.</p>
            <Link to="/components">
              <Button>
                <ArrowLeft className="mr-2" size={16} />
                Back to Components
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
            <Link to="/components">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Components
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview section */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{component.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge>{component.category}</Badge>
                {component.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span>By {component.author}</span>
                <span>•</span>
                <span>Uploaded on {formatDate(component.createdAt)}</span>
              </div>
              
              <div className="mb-6">
                <p className="text-muted-foreground">{component.description}</p>
              </div>
              
              <div className="bg-white dark:bg-card rounded-md border border-border overflow-hidden mb-6">
                <div className="aspect-video bg-secondary/30 flex items-center justify-center p-4">
                  <img 
                    src={component.image} 
                    alt={component.title} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <div className="p-4 flex justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      className={`gap-2 ${liked ? 'text-rose-500 border-rose-500 hover:bg-rose-500/10' : ''}`}
                      onClick={handleLikeToggle}
                    >
                      <Heart size={18} className={liked ? 'fill-rose-500' : ''} />
                      <span>{component.likes}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={handleShare}
                    >
                      <Share size={18} />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Source code section */}
            <div>
              <CodePreview code={component.sourceCode} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComponentDetailsPage;
