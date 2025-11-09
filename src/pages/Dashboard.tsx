import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, Plus, Building2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import ProjectForm from "@/components/ProjectForm";
import ProjectList from "@/components/ProjectList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Smart Building Planner</h1>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your building projects and generate AI-powered blueprints
          </p>
        </div>

        {showProjectForm ? (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Enter your land measurements and building specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectForm
                onSuccess={() => {
                  setShowProjectForm(false);
                  toast.success("Project created successfully!");
                }}
                onCancel={() => setShowProjectForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="mb-8">
            <Button onClick={() => setShowProjectForm(true)} size="lg" className="shadow-card">
              <Plus className="mr-2 h-5 w-5" />
              New Project
            </Button>
          </div>
        )}

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Your Projects
            </CardTitle>
            <CardDescription>View and manage your building projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
