import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

export const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageUrl = "https://www.hitpromo.net/imageManager/show/1035_group.jpg";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS if image server allows
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div>
          <div className="aspect-video rounded-xl bg-red-100 flex flex-col items-center justify-center">
            <canvas
              ref={canvasRef}
              className="rounded-xl w-full h-full object-contain"
            />
          </div>
          <Button className="mt-4 w-full">
            <SmilePlus className="w-4 h-4" />
            Add Smiley Face
          </Button>
        </div>
        {/* Repeat this block for others if needed */}
      </div>
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
    </div>
  );
};
