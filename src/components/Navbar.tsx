
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleShareProject = () => {
    if (user) {
      navigate("/upload-project");
    } else {
      navigate("/login", { state: { from: "/upload-project" } });
    }
  };

  return (
    <header className="w-full bg-white/80 dark:bg-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-searchifi-purple to-searchifi-light-purple grid place-items-center">
              <Search className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold">Searchifi</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/projects" className="nav-link">
              Explore
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleShareProject} 
            className="border-searchifi-purple text-searchifi-purple hover:bg-searchifi-purple/10"
          >
            Share Your Project
          </Button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Sign Out</Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="default" className="btn-gradient">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md absolute top-full left-0 w-full border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/projects" 
              className="block py-2 nav-link"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/about" 
              className="block py-2 nav-link"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => {
                handleShareProject();
                setIsOpen(false);
              }}
              className="border-searchifi-purple text-searchifi-purple hover:bg-searchifi-purple/10 justify-start"
            >
              Share Your Project
            </Button>
            
            <div className="border-t border-border my-2"></div>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start" 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full btn-gradient">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
