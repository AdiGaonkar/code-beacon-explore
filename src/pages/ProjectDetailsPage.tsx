
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedProjects from "@/components/RelatedProjects";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ArrowLeft, Github, ExternalLink, Code, FileCode } from "lucide-react";

// Mock project data (to be replaced with API call)
const projectsData = [
  {
    id: "1",
    title: "React Task Manager",
    description: "A beautiful task management application built with React and Firebase",
    author: "Jane Smith",
    likes: 234,
    tags: ["React", "Firebase", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    githubUrl: "https://github.com/username/react-task-manager",
    demoUrl: "https://react-task-manager-demo.com",
    sourceCode: `
// TaskList.tsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import Task from './Task';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskList);
    });
    
    return () => unsubscribe();
  }, []);
  
  const toggleComplete = async (id, isComplete) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, {
      isComplete: !isComplete
    });
  };
  
  return (
    <div className="task-list">
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add your first task!</p>
      ) : (
        tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            toggleComplete={toggleComplete}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
`
  },
  {
    id: "2",
    title: "Weather Dashboard",
    description: "Real-time weather application with beautiful visualizations",
    author: "Mike Johnson",
    likes: 186,
    tags: ["React", "API", "Chart.js"],
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    githubUrl: "https://github.com/username/weather-dashboard",
    demoUrl: "https://weather-dashboard-demo.com",
    sourceCode: `
// WeatherDisplay.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return <div>Loading weather data...</div>;
  
  const temperatures = weatherData.hourly.slice(0, 24).map(hour => hour.temp);
  const labels = weatherData.hourly.slice(0, 24).map((hour, index) => \`\${index}:00\`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature °C',
        data: temperatures,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '24-Hour Forecast',
      },
    },
  };

  return (
    <div className="weather-display">
      <h2 className="text-2xl font-bold mb-4">
        Current Weather: {weatherData.current.temp}°C
      </h2>
      <p className="mb-6">
        {weatherData.current.weather[0].description}
      </p>
      <div className="chart-container">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default WeatherDisplay;
`
  }
];

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch the project data from an API
    const fetchProject = () => {
      setLoading(true);
      const foundProject = projectsData.find(p => p.id === id);
      
      // Simulate API delay
      setTimeout(() => {
        setProject(foundProject);
        setLoading(false);
      }, 500);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-searchifi-purple border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p>Loading project details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link to="/projects">
              <Button>
                <ArrowLeft className="mr-2" size={16} />
                Back to Projects
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
          
          {/* Project header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 px-3">
                  <Heart size={18} />
                  <span>{project.likes}</span>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">By {project.author}</span>
              <span className="text-muted-foreground mx-2">•</span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/80">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Github size={16} />
                    GitHub Repository
                  </Button>
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </div>
          
          {/* Project image */}
          <div className="mb-8">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="code" className="gap-2">
                <FileCode size={16} />
                Source Code
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <Code size={16} />
                Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Source Code</h2>
                  <ScrollArea className="h-[500px] w-full rounded-md border">
                    <pre className="p-4 text-sm bg-secondary/20 rounded-md overflow-auto">
                      <code>{project.sourceCode}</code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                  <p>
                    This is a placeholder for additional project details. In a complete implementation,
                    this section could include:
                  </p>
                  <ul className="list-disc pl-6 mt-4">
                    <li>Project architecture</li>
                    <li>Technologies used</li>
                    <li>Installation instructions</li>
                    <li>API documentation</li>
                    <li>Contributors</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Related Projects Section */}
          <RelatedProjects currentProjectId={project.id} tags={project.tags} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;
