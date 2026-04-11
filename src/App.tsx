import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./App.css";
import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Events from "./pages/Events";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admission from "./pages/Admission";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminNews from "./pages/admin/AdminNews";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminSupportStaff from "./pages/admin/AdminSupportStaff";
import AdminAchievers from "./pages/admin/AdminAchievers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      gcTime: 15 * 60 * 1000, // Keep in garbage collection cache for 15 mins
      refetchOnWindowFocus: false, // Prevents aggressive refetching when switching tabs/apps on mobile
      retry: 2, // Only retry twice on slow mobile connections before giving up
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/admissions" element={<AdminAdmissions />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/teams" element={<AdminTeams />} />
            <Route path="/admin/support-staff" element={<AdminSupportStaff />} />
            <Route path="/admin/achievers" element={<AdminAchievers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
