
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { 
  Code, 
  Layout, 
  Layers, 
  Component, 
  Palette, 
  FormInput, 
  MousePointerClick, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

type ComponentCategory = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const componentCategories: ComponentCategory[] = [
  {
    id: "buttons",
    name: "Buttons",
    icon: MousePointerClick,
    description: "Various button styles for different actions and contexts"
  },
  {
    id: "cards",
    name: "Cards",
    icon: Layout,
    description: "Card layouts for showcasing content and information"
  },
  {
    id: "forms",
    name: "Form Elements",
    icon: FormInput,
    description: "Input fields, selects, checkboxes, and other form controls"
  },
  {
    id: "navigation",
    name: "Navigation",
    icon: ArrowRight,
    description: "Navbars, breadcrumbs, tabs, and other navigation components"
  },
  {
    id: "layout",
    name: "Page Layouts",
    icon: Layers,
    description: "Common page layout patterns and structures"
  },
  {
    id: "ui",
    name: "UI Elements",
    icon: Component,
    description: "Badges, tooltips, alerts, and other UI components"
  }
];

const ComponentCard = ({ category }: { category: ComponentCategory }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{category.name}</CardTitle>
          <category.icon className="text-searchifi-purple" size={24} />
        </div>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 bg-secondary/30 rounded-md flex items-center justify-center">
          {category.id === "buttons" && (
            <div className="flex flex-wrap gap-2 p-4 justify-center">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          )}
          {category.id === "cards" && (
            <div className="w-full max-w-xs p-4">
              <div className="bg-background border border-border p-4 rounded-md">
                <div className="text-left">
                  <h3 className="font-medium">Card Title</h3>
                  <p className="text-xs text-muted-foreground">Card description text</p>
                </div>
              </div>
            </div>
          )}
          {category.id === "forms" && (
            <div className="flex flex-col gap-2 w-full max-w-xs p-4">
              <Input placeholder="Text input" />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="check" className="h-4 w-4 accent-searchifi-purple" />
                <label htmlFor="check" className="text-sm">Checkbox</label>
              </div>
            </div>
          )}
          {category.id === "navigation" && (
            <div className="flex gap-4 p-4">
              <Badge>Home</Badge>
              <Badge variant="secondary">Products</Badge>
              <Badge variant="outline">About</Badge>
            </div>
          )}
          {category.id === "layout" && (
            <div className="w-full max-w-xs grid grid-cols-4 gap-1 p-2">
              <div className="bg-searchifi-purple/20 h-6 col-span-4"></div>
              <div className="bg-searchifi-purple/30 h-20 col-span-1"></div>
              <div className="bg-searchifi-purple/10 h-20 col-span-3"></div>
              <div className="bg-searchifi-purple/20 h-6 col-span-4"></div>
            </div>
          )}
          {category.id === "ui" && (
            <div className="flex flex-wrap gap-2 p-4 justify-center">
              <Badge className="bg-searchifi-purple">Badge</Badge>
              <Badge className="bg-green-500">Success</Badge>
              <Badge className="bg-yellow-500">Warning</Badge>
              <Badge className="bg-red-500">Error</Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 flex justify-between">
        <span className="text-sm text-muted-foreground">12 components</span>
        <Link to={`/components/${category.id}`}>
          <Button variant="ghost" size="sm" className="text-searchifi-purple">
            View All <ArrowRight size={16} className="ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const ComponentsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter categories if one is selected (for future expansion)
  const displayedCategories = selectedCategory 
    ? componentCategories.filter(cat => cat.id === selectedCategory) 
    : componentCategories;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
              <div className="flex items-center justify-between p-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Component size={20} className="text-searchifi-purple" />
                  Components
                </h2>
                <SidebarTrigger />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Categories</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        isActive={selectedCategory === null}
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-2"
                      >
                        <Palette size={18} />
                        <span>All Components</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    {componentCategories.map(category => (
                      <SidebarMenuItem key={category.id}>
                        <SidebarMenuButton 
                          isActive={selectedCategory === category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2"
                        >
                          <category.icon size={18} />
                          <span>{category.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Resources</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Code size={18} />
                          <span>Tailwind CSS</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <CheckCircle size={18} />
                          <span>Shadcn UI</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <main className="flex-grow">
              <div className="bg-secondary/30 dark:bg-secondary/10 py-12 px-4 border-b border-border">
                <div className="container mx-auto">
                  <h1 className="text-3xl font-bold mb-3">UI Components</h1>
                  <p className="text-muted-foreground max-w-3xl">
                    Browse our collection of UI components to use in your projects. 
                    These components are built with Tailwind CSS and can be easily customized to fit your design needs.
                  </p>
                  
                  <div className="mt-6">
                    <div className="relative max-w-md">
                      <Input 
                        placeholder="Search components..." 
                        className="pl-10"
                      />
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <section className="py-12 px-4">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedCategories.map(category => (
                      <ComponentCard key={category.id} category={category} />
                    ))}
                  </div>
                  
                  {displayedCategories.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-xl font-medium">No components found</p>
                      <p className="text-muted-foreground">Try adjusting your search criteria</p>
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

export default ComponentsPage;
