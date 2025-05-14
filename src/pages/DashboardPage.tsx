import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Edit, Trash, Eye } from "lucide-react";
import { 
  getProjects, 
  formatDate,
  getUserProfile,
  deleteProject,
  Project
} from "@/utils/projectUtils";
import { toast } from "@/components/ui/use-toast";
import { DeleteProjectDialog } from "@/components/DeleteProjectDialog";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  
  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  // Redirect if not logged in
  if (!user) {
    navigate("/login", { state: { from: "/dashboard" } });
    return null;
  }
  
  // Load projects on mount or when user changes
  useEffect(() => {
    if (!user) return;
    
    // Get all projects
    const allProjects = getProjects();
    
    // Filter user's projects
    const userProjects = allProjects.filter(project => project.authorId === user.id);
    setProjects(userProjects);
    
    // Get user profile with saved and liked projects
    const userProfile = getUserProfile(user.id);
    
    // Get saved projects
    const userSavedProjects = allProjects.filter(project => 
      userProfile.savedProjects.includes(project.id)
    );
    setSavedProjects(userSavedProjects);
    
    // Get liked projects
    const userLikedProjects = allProjects.filter(project => 
      userProfile.likedProjects.includes(project.id)
    );
    setLikedProjects(userLikedProjects);
  }, [user]);
  
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (projectId: string) => {
    if (deleteProject(user.id, projectId)) {
      // Update the projects list
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User Profile Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white dark:bg-card shadow-card rounded-lg p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Link to="/profile/settings">
                    <Button variant="outline" className="w-full justify-start">
                      Profile Settings
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    Account Security
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notifications
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="md:w-3/4">
              <Tabs
                defaultValue="projects"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="projects">My Projects</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                
                {/* My Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Your Projects</h3>
                    <Link to="/upload-project">
                      <Button className="btn-gradient">Upload New Project</Button>
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-card shadow-card rounded-lg overflow-hidden">
                    {projects.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">You haven't uploaded any projects yet</p>
                        <Link to="/upload-project">
                          <Button className="btn-gradient">Upload Your First Project</Button>
                        </Link>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Language</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{project.title}</div>
                                  <div className="text-xs text-muted-foreground md:hidden">
                                    {project.language} · {formatDate(project.createdAt)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {project.language}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDate(project.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={project.status === "published" ? "default" : "outline"}
                                  className={project.status === "published" 
                                    ? "bg-searchifi-purple" 
                                    : "border-searchifi-purple text-searchifi-purple"
                                  }
                                >
                                  {project.status === "published" ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Link to={`/projects/${project.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye size={16} />
                                    </Button>
                                  </Link>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit size={16} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteClick(project)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </TabsContent>
                
                {/* Saved Projects Tab */}
                <TabsContent value="saved" className="space-y-6">
                  <h3 className="text-xl font-semibold">Saved Projects</h3>
                  
                  {savedProjects.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">You haven't saved any projects yet</p>
                        <Link to="/projects">
                          <Button className="btn-gradient">Browse Projects</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedProjects.map((project) => (
                        <div key={project.id} className="project-card flex flex-col h-full">
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-grow p-4">
                            <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-xs text-muted-foreground">
                                By {project.author}
                              </span>
                              <Link to={`/projects/${project.id}`}>
                                <Button variant="ghost" size="sm" className="text-primary">
                                  View <ArrowRight size={14} className="ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites" className="space-y-6">
                  <h3 className="text-xl font-semibold">Favorite Projects</h3>
                  
                  {likedProjects.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">
                          You haven't liked any projects yet
                        </p>
                        <Link to="/projects">
                          <Button className="btn-gradient">Discover Projects</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {likedProjects.map((project) => (
                        <div key={project.id} className="project-card flex flex-col h-full">
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col flex-grow p-4">
                            <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                              <span className="text-xs text-muted-foreground">
                                By {project.author}
                              </span>
                              <Link to={`/projects/${project.id}`}>
                                <Button variant="ghost" size="sm" className="text-primary">
                                  View <ArrowRight size={14} className="ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Delete Project Confirmation Dialog */}
      <DeleteProjectDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        project={projectToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DashboardPage;
