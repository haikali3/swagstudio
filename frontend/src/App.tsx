import "./App.css";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import Header from "./components/header/header";
import { Home } from "./pages/home";

function App() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <Home />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
