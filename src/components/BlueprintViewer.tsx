import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlueprintViewerProps {
  blueprint: {
    blueprint_json: any;
    svg_data: string | null;
  };
}

const BlueprintViewer = ({ blueprint }: BlueprintViewerProps) => {
  if (blueprint.svg_data) {
    return (
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>2D Blueprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="w-full bg-white rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: blueprint.svg_data }}
          />
        </CardContent>
      </Card>
    );
  }

  // Fallback visualization if no SVG
  const data = blueprint.blueprint_json;
  
  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>Blueprint Layout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-8 rounded-lg">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlueprintViewer;
