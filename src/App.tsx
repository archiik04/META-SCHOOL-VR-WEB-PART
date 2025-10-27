import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AIMindGames from "./pages/AIMindGames";
import AIAudiobooks from "./pages/AIAudiobooks";
import Schedule from "./pages/Schedule";
import Attendance from "./pages/Attendance";
import Leaderboard from "./pages/Leaderboard";
import VideoGenerator from "./pages/VideoGenerator";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <Sidebar />
                    <main className="flex-1 p-8 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/video" element={<VideoGenerator />} />
                        <Route path="/games" element={<AIMindGames />} />
                        <Route path="/audiobooks" element={<AIAudiobooks />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
