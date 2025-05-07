
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignUpConfirmation from "./pages/SignUpConfirmation";
import Profile from "./pages/Profile";
import DictionaryPage from "./pages/DictionaryPage";
import AddDictionaryEntry from "./pages/AddDictionaryEntry";
import EditDictionaryEntry from "./pages/EditDictionaryEntry";
import DictionaryEntryDetail from "./pages/DictionaryEntryDetail";
import ContentPage from "./pages/ContentPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/signin" element={<Layout><SignIn /></Layout>} />
            <Route path="/signup" element={<Layout><SignUp /></Layout>} />
            <Route path="/signup/confirmation" element={<Layout><SignUpConfirmation /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/dictionary" element={<Layout><DictionaryPage /></Layout>} />
            <Route path="/dictionary/add" element={<Layout><AddDictionaryEntry /></Layout>} />
            <Route path="/dictionary/edit/:id" element={<Layout><EditDictionaryEntry /></Layout>} />
            <Route path="/dictionary/:id" element={<Layout><DictionaryEntryDetail /></Layout>} />
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/about" element={<Layout><ContentPage /></Layout>} />
            <Route path="/faq" element={<Layout><ContentPage /></Layout>} />
            <Route path="/tutorials" element={<Layout><ContentPage /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
