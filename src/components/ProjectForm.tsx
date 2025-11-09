import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm = ({ onSuccess, onCancel }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    buildingType: "house",
    landWidth: "",
    landLength: "",
    floors: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      const { error: projectError } = await supabase.from("projects").insert({
        user_id: user.id,
        name: formData.name,
        building_type: formData.buildingType,
        land_width: parseFloat(formData.landWidth),
        land_length: parseFloat(formData.landLength),
        floors: parseInt(formData.floors),
      });

      if (projectError) throw projectError;

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="My Dream House"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buildingType">Building Type</Label>
          <Select
            value={formData.buildingType}
            onValueChange={(value) => setFormData({ ...formData, buildingType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="landWidth">Land Width (meters)</Label>
          <Input
            id="landWidth"
            type="number"
            step="0.1"
            min="1"
            placeholder="15.5"
            value={formData.landWidth}
            onChange={(e) => setFormData({ ...formData, landWidth: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="landLength">Land Length (meters)</Label>
          <Input
            id="landLength"
            type="number"
            step="0.1"
            min="1"
            placeholder="20.0"
            value={formData.landLength}
            onChange={(e) => setFormData({ ...formData, landLength: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="floors">Number of Floors</Label>
          <Input
            id="floors"
            type="number"
            min="1"
            max="10"
            placeholder="1"
            value={formData.floors}
            onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Project
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
