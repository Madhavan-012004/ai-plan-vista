import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Model3DViewerProps {
  blueprintData: any;
}

const Model3DViewer = ({ blueprintData }: Model3DViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple 3D isometric visualization
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw isometric grid
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * 30, 50);
      ctx.lineTo(50 + i * 30 - 200, 250);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(50, 50 + i * 10);
      ctx.lineTo(650, 50 + i * 10);
      ctx.stroke();
    }

    // Draw simple 3D building representation
    if (blueprintData?.rooms) {
      ctx.fillStyle = "#3b82f6";
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 2;

      blueprintData.rooms.forEach((room: any, index: number) => {
        const x = 150 + (index % 3) * 120;
        const y = 150 + Math.floor(index / 3) * 80;
        
        // Draw isometric box
        ctx.fillStyle = index % 2 === 0 ? "#60a5fa" : "#3b82f6";
        
        // Top face
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 60, y + 30);
        ctx.lineTo(x + 60, y + 80);
        ctx.lineTo(x, y + 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Side face
        ctx.fillStyle = index % 2 === 0 ? "#3b82f6" : "#2563eb";
        ctx.beginPath();
        ctx.moveTo(x, y + 50);
        ctx.lineTo(x + 60, y + 80);
        ctx.lineTo(x + 60, y + 130);
        ctx.lineTo(x, y + 100);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.fillText(room.type || "Room", x + 10, y + 80);
      });
    } else {
      // Default building if no rooms data
      ctx.fillStyle = "#3b82f6";
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(300, 150);
      ctx.lineTo(400, 200);
      ctx.lineTo(400, 300);
      ctx.lineTo(300, 250);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.moveTo(300, 250);
      ctx.lineTo(400, 300);
      ctx.lineTo(400, 400);
      ctx.lineTo(300, 350);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

  }, [blueprintData]);

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle>3D Model Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full border rounded-lg bg-white"
        />
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Isometric 3D visualization of your building layout
        </p>
      </CardContent>
    </Card>
  );
};

export default Model3DViewer;
