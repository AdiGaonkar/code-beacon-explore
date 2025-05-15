
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, Component } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UploadOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadOptions = ({ open, onOpenChange }: UploadOptionsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleOptionSelect = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login", { state: { from: path } });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your work</DialogTitle>
          <DialogDescription>
            Choose what type of content you want to share with the community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => handleOptionSelect("/upload-project")}
            className="h-auto py-6 flex flex-col items-center gap-3 hover:border-searchifi-purple hover:bg-searchifi-purple/5"
          >
            <Code size={24} className="text-searchifi-purple" />
            <div className="text-center">
              <h3 className="font-medium mb-1">Project</h3>
              <p className="text-xs text-muted-foreground">
                Share a full project with source code
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleOptionSelect("/upload-component")}
            className="h-auto py-6 flex flex-col items-center gap-3 hover:border-searchifi-purple hover:bg-searchifi-purple/5"
          >
            <Component size={24} className="text-searchifi-purple" />
            <div className="text-center">
              <h3 className="font-medium mb-1">Component</h3>
              <p className="text-xs text-muted-foreground">
                Share a reusable UI component
              </p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadOptions;
