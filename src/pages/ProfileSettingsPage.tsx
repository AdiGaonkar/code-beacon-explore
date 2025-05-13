import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";

const ProfileSettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/login", { state: { from: "/profile/settings" } });
    return null;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd upload the avatar file to a server
      // For now, we'll just use the data URL directly
      const updatedProfile = {
        ...user,
        name: formData.name,
        bio: formData.bio,
        avatar: avatarPreview,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      updateUserProfile(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
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
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Update your personal information and profile picture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Click on your avatar to change your profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div 
                  className="relative cursor-pointer group mb-4" 
                  onClick={handleAvatarClick}
                >
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={32} />
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Recommended: Square image, at least 400x400 pixels.
                </p>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <Card className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account details and public profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="h-20"
                      placeholder="Tell others a bit about yourself..."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="btn-gradient" 
                    disabled={isSubmitting}
                  >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSettingsPage;
