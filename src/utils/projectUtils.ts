
import { toast } from "@/components/ui/use-toast";

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  likes: number;
  tags: string[];
  language: string;
  image: string;
  createdAt: string;
  repoUrl: string;
  demoUrl?: string;
  fileName?: string;
  status?: 'published' | 'draft';
}

// Helper to get actual projects from localStorage
export const getProjects = (): Project[] => {
  try {
    return JSON.parse(localStorage.getItem('searchifi_projects') || '[]');
  } catch (e) {
    console.error('Error getting projects:', e);
    return [];
  }
};

// Helper to save projects to localStorage
export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem('searchifi_projects', JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects:', e);
    toast({
      title: "Error",
      description: "Failed to save project data",
      variant: "destructive",
    });
  }
};

// Get user profile
export const getUserProfile = (userId: string) => {
  try {
    return JSON.parse(localStorage.getItem(`searchifi_user_${userId}`) || JSON.stringify({
      savedProjects: [],
      likedProjects: [],
    }));
  } catch (e) {
    console.error('Error getting user profile:', e);
    return { savedProjects: [], likedProjects: [] };
  }
};

// Save user profile
export const saveUserProfile = (userId: string, profile: any) => {
  try {
    localStorage.setItem(`searchifi_user_${userId}`, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile:', e);
  }
};

// Toggle save project
export const toggleSaveProject = (userId: string, projectId: string): boolean => {
  if (!userId) return false;
  
  const profile = getUserProfile(userId);
  const isSaved = profile.savedProjects.includes(projectId);
  
  if (isSaved) {
    profile.savedProjects = profile.savedProjects.filter((id: string) => id !== projectId);
    saveUserProfile(userId, profile);
    toast({
      title: "Project removed",
      description: "Project removed from saved items",
    });
    return false;
  } else {
    profile.savedProjects.push(projectId);
    saveUserProfile(userId, profile);
    toast({
      title: "Project saved",
      description: "Project saved to your profile",
    });
    return true;
  }
};

// Toggle like project
export const toggleLikeProject = (userId: string, projectId: string): boolean => {
  if (!userId) return false;
  
  const profile = getUserProfile(userId);
  const isLiked = profile.likedProjects.includes(projectId);
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) return false;
  
  if (isLiked) {
    profile.likedProjects = profile.likedProjects.filter((id: string) => id !== projectId);
    projects[projectIndex].likes = Math.max(0, (projects[projectIndex].likes || 0) - 1);
    saveUserProfile(userId, profile);
    saveProjects(projects);
    return false;
  } else {
    profile.likedProjects.push(projectId);
    projects[projectIndex].likes = (projects[projectIndex].likes || 0) + 1;
    saveUserProfile(userId, profile);
    saveProjects(projects);
    return true;
  }
};

// Check if project is saved by user
export const isProjectSaved = (userId: string, projectId: string): boolean => {
  if (!userId) return false;
  const profile = getUserProfile(userId);
  return profile.savedProjects.includes(projectId);
};

// Check if project is liked by user
export const isProjectLiked = (userId: string, projectId: string): boolean => {
  if (!userId) return false;
  const profile = getUserProfile(userId);
  return profile.likedProjects.includes(projectId);
};

// Delete project
export const deleteProject = (userId: string, projectId: string): boolean => {
  if (!userId) return false;
  
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId && p.authorId === userId);
  
  if (projectIndex === -1) return false;
  
  projects.splice(projectIndex, 1);
  saveProjects(projects);
  
  toast({
    title: "Project deleted",
    description: "Your project has been deleted successfully",
  });
  
  return true;
};

// Helper to format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Generate project download URL
export const getDownloadUrl = (project: Project): string => {
  // In a real app, this would be an API endpoint that serves the file
  // For now, we'll just simulate it with a data URI
  return `data:application/zip;base64,UEsDBBQAAAAIAC2RQVcAAAAA`;
};

// Share project
export const shareProject = (project: Project) => {
  if (navigator.share) {
    navigator.share({
      title: project.title,
      text: project.description,
      url: window.location.href,
    }).catch(err => {
      console.error('Error sharing:', err);
      copyToClipboard(window.location.href);
    });
  } else {
    copyToClipboard(window.location.href);
  }
};

// Copy to clipboard helper
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast({
      title: "Link copied!",
      description: "Project link copied to clipboard",
    });
  }).catch(err => {
    console.error('Failed to copy:', err);
    toast({
      title: "Failed to copy",
      description: "Please try again",
      variant: "destructive",
    });
  });
};
