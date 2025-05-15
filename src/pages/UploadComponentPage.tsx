
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, Code } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput = ({ tags, setTags }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < 5) {
      setTags([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="Add up to 5 tags (press Enter after each)"
          className="flex-grow"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1 flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-muted-foreground">No tags added yet</span>
        )}
      </div>
    </div>
  );
};

const componentCategories = [
  "Buttons",
  "Cards",
  "Form Elements",
  "Navigation",
  "Page Layouts",
  "UI Elements",
  "Tables",
  "Lists",
  "Modals",
  "Other"
];

const UploadComponentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sourceCode, setSourceCode] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login", { state: { from: "/upload-component" } });
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || tags.length === 0 || !sourceCode || !previewImage) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new component object
      const newComponent = {
        id: crypto.randomUUID(),
        title,
        description,
        author: user.name || user.email,
        authorId: user.id,
        category,
        tags,
        sourceCode,
        image: previewImage,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing components or initialize empty array
      const existingComponents = JSON.parse(localStorage.getItem('searchifi_components') || '[]');
      
      // Add new component
      const updatedComponents = [...existingComponents, newComponent];
      
      // Save back to localStorage
      localStorage.setItem('searchifi_components', JSON.stringify(updatedComponents));
      
      toast({
        title: "Component uploaded successfully",
        description: "Your component has been shared with the community",
      });
      
      // Navigate to components page
      navigate("/components");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your component",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Share Your UI Component</h1>
            <p className="text-muted-foreground">
              Share your beautiful UI components with the community and help others build amazing projects.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Component Name</Label>
                <Input
                  id="title"
                  placeholder="E.g., Custom Animated Button"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your component and how to use it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[150px]"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {componentCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (technologies used)</Label>
                <TagInput tags={tags} setTags={setTags} />
              </div>
              
              <div>
                <Label htmlFor="source">Source Code</Label>
                <Textarea
                  id="source"
                  placeholder="Paste your component's source code here..."
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  required
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="image">Preview Image</Label>
                <div className="mt-2">
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Component preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                            setImageFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload
                          className="mx-auto h-12 w-12 text-muted-foreground"
                          strokeWidth={1}
                        />
                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                          <span className="relative rounded-md font-medium text-primary hover:underline focus-within:outline-none">
                            Upload an image
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex gap-2"
              >
                {isSubmitting && <div className="animate-spin">◌</div>}
                Share Component
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadComponentPage;
