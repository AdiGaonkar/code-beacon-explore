
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem("searchifi_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock login - in a real app, this would be an API call
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: "user123",
        name: "Demo User",
        email: email,
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=" + email,
      };

      // Store user in localStorage for persistence
      localStorage.setItem("searchifi_user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Mock registration - in a real app, this would be an API call
      const mockUser = {
        id: "user" + Math.floor(Math.random() * 1000),
        name: name,
        email: email,
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=" + email,
      };

      // Store user in localStorage for persistence
      localStorage.setItem("searchifi_user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Clear user data
    localStorage.removeItem("searchifi_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
