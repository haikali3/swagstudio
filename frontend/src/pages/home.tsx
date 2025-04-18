import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

export const Home = () => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isAnnotating, setIsAnnotating] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [rectCoords, setRectCoords] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const imageUrl =
    "http://localhost:3001/proxy-image?url=https://www.hitpromo.net/imageManager/show/1035_group.jpg";

  // Load image onto base canvas
  useEffect(() => {
    const imgCanvas = imageCanvasRef.current;
    const ovlCanvas = overlayCanvasRef.current;
    if (!imgCanvas || !ovlCanvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      [imgCanvas, ovlCanvas].forEach((c) => {
        c.width = img.width;
        c.height = img.height;
      });
      imgCanvas.getContext("2d")!.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Handle drawing on overlay canvas with proper scaling
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || !isAnnotating) return;
    const ctx = canvas.getContext("2d")!;

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      setIsDrawing(true);
      setStartPos({ x, y });
      setRectCoords({ x, y, w: 0, h: 0 });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const w = x - startPos.x;
      const h = y - startPos.y;

      setRectCoords({ x: startPos.x, y: startPos.y, w, h });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(startPos.x, startPos.y, w, h);
    };

    const onMouseUp = () => setIsDrawing(false);

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isAnnotating, isDrawing, startPos]);

  // Send coordinates to backend
  const sendCoords = async () => {
    if (!rectCoords.w || !rectCoords.h) return;
    try {
      await axios.post("http://localhost:3001/api/imprint-location", {
        productId: "1035",
        x: rectCoords.x,
        y: rectCoords.y,
        width: rectCoords.w,
        height: rectCoords.h,
      });
      alert("Coordinates sent!");
      setIsAnnotating(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send coordinates");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div>
          <div className="rounded-xl bg-muted/50 aspect-square flex items-center justify-center relative">
            <canvas
              ref={imageCanvasRef}
              className="rounded-xl w-full h-full object-contain"
            />
            <canvas
              ref={overlayCanvasRef}
              className={`absolute inset-0 rounded-xl w-full h-full ${
                isAnnotating ? "" : "pointer-events-none"
              }`}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button onClick={() => setIsAnnotating((f) => !f)}>
              <SmilePlus className="w-4 h-4" />
              {isAnnotating ? "Cancel Draw" : "Draw Imprint Box"}
            </Button>
            {isAnnotating && rectCoords.w && rectCoords.h && (
              <Button onClick={sendCoords}>Save Box</Button>
            )}
            <Button>
              <SmilePlus className="w-4 h-4" />
              Add Smiley Face
            </Button>
          </div>
        </div>
        {/* Future product cards can be added here in the same grid */}
      </div>
    </div>
  );
};
