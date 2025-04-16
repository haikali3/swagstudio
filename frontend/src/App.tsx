import "./App.css";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { SmilePlus } from "lucide-react";
import Header from "./components/header/header";

function App() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div>
                <div className="aspect-video rounded-xl bg-muted/50 flex flex-col items-center justify-center"></div>
                <Button
                  // onClick={generateSmiley}
                  // disabled={loading}
                  className="mt-4 w-full"
                >
                  <SmilePlus className="w-4 h-4" />
                  {/* {loading ? "Generating..." : "Add Smiley Face"} */}
                  Add Smiley Face
                </Button>
              </div>
              <div>
                <div className="aspect-video rounded-xl bg-muted/50 flex flex-col items-center justify-center"></div>
                <Button className="mt-4 w-full">
                  <SmilePlus className="w-4 h-4" />
                  Add Smiley Face
                </Button>
              </div>
              <div>
                <div className="aspect-video rounded-xl bg-muted/50 flex flex-col items-center justify-center"></div>
                <Button className="mt-4 w-full">
                  <SmilePlus className="w-4 h-4" />
                  Add Smiley Face
                </Button>
              </div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
