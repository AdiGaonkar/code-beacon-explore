
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowRight, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - in a real app this would come from an API
const userProjects = [
  {
    id: "user-1",
    title: "Personal Portfolio",
    description: "My personal portfolio website",
    language: "React",
    createdAt: "2025-04-15T10:30:00Z",
    status: "published",
  },
  {
    id: "user-2",
    title: "Task Manager App",
    description: "A simple task management application",
    language: "React, Firebase",
    createdAt: "2025-05-02T15:45:00Z",
    status: "published",
  },
  {
    id: "user-3",
    title: "E-commerce Dashboard",
    description: "Admin dashboard for an e-commerce site",
    language: "React, Redux",
    createdAt: "2025-05-08T09:15:00Z",
    status: "draft",
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  // Redirect if not logged in
  if (!user) {
    navigate("/login", { state: { from: "/dashboard" } });
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User Profile Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white dark:bg-card shadow-md rounded-lg p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-searchifi-purple/20 mb-4 flex items-center justify-center text-3xl font-bold text-searchifi-purple">
                    {user.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Profile Settings
                  </Button>
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
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projects" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Your Projects</h3>
                    <Link to="/upload-project">
                      <Button className="btn-gradient">Upload New Project</Button>
                    </Link>
                  </div>
                  
                  <div className="bg-white dark:bg-card shadow-md rounded-lg overflow-hidden">
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
                        {userProjects.map((project) => (
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
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit size={16} />
                                </Button>
                                <Link to={`/projects/${project.id}`}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ArrowRight size={16} />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-6">
                  <h3 className="text-xl font-semibold">Recent Activity</h3>
                  <div className="bg-white dark:bg-card shadow-md rounded-lg p-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Your recent activity will appear here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="space-y-6">
                  <h3 className="text-xl font-semibold">Favorite Projects</h3>
                  <div className="bg-white dark:bg-card shadow-md rounded-lg p-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Projects you favorite will appear here</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
