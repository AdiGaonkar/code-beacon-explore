
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Filter, Heart, ArrowRight, Code, Layers } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarTrigger,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset
} from "@/components/ui/sidebar";

// Mock data
const defaultProjects = [
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
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Modern portfolio website with animations and dark mode",
    author: "Chris Davis",
    likes: 178,
    tags: ["React", "Three.js", "GSAP"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    title: "Recipe Finder App",
    description: "Search for recipes based on ingredients you have at home",
    author: "Sarah Miller",
    likes: 257,
    tags: ["Vue", "API", "Vuex"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    title: "Blog Platform",
    description: "A full-featured blog platform with markdown support",
    author: "David Wilson",
    likes: 195,
    tags: ["Next.js", "MDX", "Prisma"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  }
];

// Programming languages for sidebar
const programmingLanguages = [
  { name: "JavaScript", count: 128 },
  { name: "TypeScript", count: 87 },
  { name: "Python", count: 64 },
  { name: "Java", count: 42 },
  { name: "C#", count: 38 },
  { name: "PHP", count: 31 },
  { name: "Go", count: 27 },
  { name: "Rust", count: 18 },
  { name: "Ruby", count: 16 },
  { name: "Swift", count: 14 },
  { name: "Kotlin", count: 11 },
  { name: "Dart", count: 9 }
];

// Project categories
const projectCategories = [
  { name: "Web Applications", count: 145 },
  { name: "Mobile Apps", count: 78 },
  { name: "Data Science", count: 56 },
  { name: "UI Components", count: 38 },
  { name: "API & Backend", count: 29 },
  { name: "Tools & Utilities", count: 21 }
];

const ProjectCard = ({ project }: { project: any }) => {
  return (
    <div className="project-card flex flex-col h-full">
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
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart size={16} className="text-searchifi-purple" />
            <span>{project.likes}</span>
          </div>
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

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get user submitted projects and combine with default projects
  useEffect(() => {
    const userProjects = JSON.parse(localStorage.getItem('searchifi_projects') || '[]');
    const combinedProjects = [...defaultProjects, ...userProjects];
    setAllProjects(combinedProjects);
    
    // Extract all unique tags
    const tags = Array.from(
      new Set(
        combinedProjects.flatMap(project => 
          project.tags ? project.tags : []
        )
      )
    );
    setAllTags(tags as string[]);
  }, []);

  // Filter projects based on search term, selected tags, languages, and categories
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                        (project.tags && selectedTags.some(tag => project.tags.includes(tag)));
    
    // For demo purposes, we'll pretend all projects match the selected languages and categories
    const matchesLanguages = selectedLanguages.length === 0 || true;
    const matchesCategories = selectedCategories.length === 0 || true;
    
    return matchesSearch && matchesTags && matchesLanguages && matchesCategories;
  });

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
    setCurrentPage(1);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
              <div className="flex items-center justify-between p-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Layers size={20} className="text-searchifi-purple" />
                  Filters
                </h2>
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Languages</SidebarGroupLabel>
                <SidebarGroupContent className="space-y-1">
                  {programmingLanguages.map((lang) => (
                    <div key={lang.name} className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-secondary/50 cursor-pointer">
                      <Checkbox 
                        id={`lang-${lang.name}`} 
                        checked={selectedLanguages.includes(lang.name)}
                        onCheckedChange={() => toggleLanguage(lang.name)}
                        className="border-searchifi-purple data-[state=checked]:bg-searchifi-purple"
                      />
                      <label
                        htmlFor={`lang-${lang.name}`}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {lang.name}
                      </label>
                      <span className="text-xs text-muted-foreground">{lang.count}</span>
                    </div>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Project Categories</SidebarGroupLabel>
                <SidebarGroupContent className="space-y-1">
                  {projectCategories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-secondary/50 cursor-pointer">
                      <Checkbox 
                        id={`cat-${category.name}`} 
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => toggleCategory(category.name)}
                        className="border-searchifi-purple data-[state=checked]:bg-searchifi-purple"
                      />
                      <label
                        htmlFor={`cat-${category.name}`}
                        className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                      <span className="text-xs text-muted-foreground">{category.count}</span>
                    </div>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <main className="flex-grow">
              <div className="bg-secondary/30 dark:bg-secondary/10 py-12 px-4 border-b border-border">
                <div className="container mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input 
                        placeholder="Search for projects..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div>
                      <Button variant="outline" className="w-full md:w-auto gap-2">
                        <Filter size={18} />
                        Filters
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {allTags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTags.includes(tag) 
                            ? "bg-searchifi-purple" 
                            : "hover:bg-searchifi-purple/10"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <section className="py-12 px-4">
                <div className="container mx-auto">
                  <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Most Recent
                      </Button>
                      <Button variant="ghost" size="sm">
                        Most Popular
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                  
                  {filteredProjects.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-xl font-medium mb-2">No projects found</p>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {filteredProjects.length > 0 && (
                    <div className="mt-12">
                      <Pagination>
                        <PaginationContent>
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                            </PaginationItem>
                          )}
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                isActive={page === currentPage}
                                onClick={() => handlePageChange(page)}
                                className={page === currentPage ? "bg-searchifi-purple text-white border-searchifi-purple hover:bg-searchifi-purple/90" : ""}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </section>
            </main>
          </SidebarInset>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default ProjectsPage;
