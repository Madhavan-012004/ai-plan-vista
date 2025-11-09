import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Layers, Ruler, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  building_type: string;
  land_width: number;
  land_length: number;
  floors: number;
  created_at: string;
}

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error: any) {
      toast.error("Failed to load projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getBuildingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      house: "bg-blue-500",
      office: "bg-purple-500",
      hospital: "bg-red-500",
      school: "bg-green-500",
      warehouse: "bg-orange-500",
      apartment: "bg-cyan-500",
    };
    return colors[type] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
        <p className="text-muted-foreground">
          Create your first project to get started with AI-powered building planning
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-elegant transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <Badge className={`${getBuildingTypeColor(project.building_type)} text-white`}>
                {project.building_type}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription>
              Created {new Date(project.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4" />
                <span>
                  {project.land_width}m × {project.land_length}m
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>{project.floors} floor(s)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
