
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, FileArchive, Image } from "lucide-react";

const UploadProjectPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repoUrl: "",
    demoUrl: "",
    tags: "",
    language: "",
  });

  // Redirect if not logged in
  if (!user) {
    navigate("/login", { state: { from: "/upload-project" } });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/zip" && !file.name.endsWith('.zip')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a ZIP file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file format",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedThumbnail(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerThumbnailInput = () => {
    thumbnailInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Missing project file",
        description: "Please upload your project ZIP file.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.repoUrl) {
      toast({
        title: "Repository URL required",
        description: "Please enter your GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedThumbnail) {
      toast({
        title: "Missing thumbnail",
        description: "Please upload a thumbnail image for your project.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be replaced with an API call to upload the project
      console.log("Form data to submit:", formData);
      console.log("File to upload:", selectedFile);
      console.log("Thumbnail to upload:", selectedThumbnail);
      
      // For now, we'll just use the thumbnail preview directly
      // In a real app, you would upload this to a server
      const imageUrl = thumbnailPreview;
      
      // For now, we'll just save it to localStorage to simulate
      // a database operation
      const existingProjects = JSON.parse(localStorage.getItem('searchifi_projects') || '[]');
      
      const newProject = {
        id: `project-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        repoUrl: formData.repoUrl,
        demoUrl: formData.demoUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        language: formData.language,
        author: user.name,
        authorId: user.id,
        likes: 0,
        createdAt: new Date().toISOString(),
        image: imageUrl,
        fileName: selectedFile.name,
        status: "published"
      };
      
      existingProjects.push(newProject);
      localStorage.setItem('searchifi_projects', JSON.stringify(existingProjects));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Project uploaded successfully!",
        description: "Your project has been shared with the community.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading project:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-card shadow-card rounded-lg p-6 md:p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-searchifi-purple to-searchifi-light-purple grid place-items-center">
                <Upload className="text-white" size={20} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-8">Share Your Project</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter your project title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your project in detail"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="repoUrl">Repository URL (required)</Label>
                  <Input
                    id="repoUrl"
                    name="repoUrl"
                    placeholder="GitHub/GitLab URL"
                    value={formData.repoUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Live Demo URL (optional)</Label>
                  <Input
                    id="demoUrl"
                    name="demoUrl"
                    placeholder="https://your-demo.com"
                    value={formData.demoUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Primary Language/Framework</Label>
                  <Input
                    id="language"
                    name="language"
                    placeholder="e.g. React, Python, etc."
                    value={formData.language}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="e.g. frontend, api, database"
                    value={formData.tags}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Project Thumbnail</Label>
                <div 
                  className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors ${
                    thumbnailPreview ? 'border-primary' : 'border-input hover:border-searchifi-purple'
                  }`}
                  onClick={triggerThumbnailInput}
                >
                  <input 
                    type="file" 
                    ref={thumbnailInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  
                  {thumbnailPreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-xs mx-auto mb-4">
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="rounded-md w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1">
                          <Image size={16} />
                        </div>
                      </div>
                      <p className="text-sm text-center text-primary">Click to change thumbnail</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <Image className="w-10 h-10 mb-4 text-muted-foreground" />
                      <p className="font-medium">Upload project thumbnail</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Recommended: 16:9 ratio, high resolution
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Project ZIP File</Label>
                <div className="border-2 border-dashed border-input rounded-md p-6 cursor-pointer hover:border-searchifi-purple transition-colors"
                     onClick={triggerFileInput}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".zip"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileArchive className="w-10 h-10 mb-4 text-muted-foreground" />
                    {selectedFile ? (
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Upload your project as ZIP file</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Click to browse or drag and drop
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-gradient" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Upload Project"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadProjectPage;
