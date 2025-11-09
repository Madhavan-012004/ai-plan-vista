import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Sparkles, Eye, Box } from "lucide-react";
import { toast } from "sonner";
import BlueprintViewer from "@/components/BlueprintViewer";
import Model3DViewer from "@/components/Model3DViewer";

interface Project {
  id: string;
  name: string;
  building_type: string;
  land_width: number;
  land_length: number;
  floors: number;
}

interface Blueprint {
  blueprint_json: any;
  svg_data: string | null;
}

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchBlueprint();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlueprint = async () => {
    try {
      const { data, error } = await supabase
        .from("blueprints")
        .select("*")
        .eq("project_id", id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setBlueprint(data);
    } catch (error: any) {
      console.error("Error fetching blueprint:", error);
    }
  };

  const generateBlueprint = async () => {
    if (!project) return;
    
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blueprint", {
        body: {
          projectId: project.id,
          buildingType: project.building_type,
          landWidth: project.land_width,
          landLength: project.land_length,
          floors: project.floors,
        },
      });

      if (error) throw error;

      toast.success("Blueprint generated successfully!");
      fetchBlueprint();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate blueprint");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{project.name}</CardTitle>
                <CardDescription>
                  {project.land_width}m × {project.land_length}m • {project.floors} floor(s)
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {project.building_type}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {!blueprint ? (
          <Card className="shadow-elegant">
            <CardContent className="pt-12 pb-12 text-center">
              <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generate AI Blueprint</h3>
              <p className="text-muted-foreground mb-6">
                Use AI to automatically generate a professional 2D blueprint for this project
              </p>
              <Button onClick={generateBlueprint} disabled={generating} size="lg">
                {generating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {generating ? "Generating..." : "Generate Blueprint"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <Button
                variant={view === "2d" ? "default" : "outline"}
                onClick={() => setView("2d")}
              >
                <Eye className="mr-2 h-4 w-4" />
                2D Blueprint
              </Button>
              <Button
                variant={view === "3d" ? "default" : "outline"}
                onClick={() => setView("3d")}
              >
                <Box className="mr-2 h-4 w-4" />
                3D Model
              </Button>
            </div>

            {view === "2d" ? (
              <BlueprintViewer blueprint={blueprint} />
            ) : (
              <Model3DViewer blueprintData={blueprint.blueprint_json} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
