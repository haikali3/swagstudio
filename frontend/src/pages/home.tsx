import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

export const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 👇 Replaced with your local proxy URL
  const imageUrl =
    "http://localhost:3001/proxy-image?url=https://www.hitpromo.net/imageManager/show/1035_group.jpg";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Not strictly needed here, but doesn't hurt
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div>
          <div className="rounded-xl bg-muted/50 aspect-square flex flex-col items-center justify-center">
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
      </div>
    </div>
  );
};
