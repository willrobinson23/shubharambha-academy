import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Academics", path: "/academics" },
  { label: "Events & Notices", path: "/events" },
  { label: "News", path: "/news" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-sm border-b"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between h-20 md:h-24">
        <a href="/" className="flex items-center">
          <img src="/logo.png" alt="Shubharambha Academy" className="h-12 md:h-16 lg:h-20 w-auto" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <a
              key={link.path}
              href={link.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-2 mr-2">
            <a href="https://www.facebook.com/profile.php?id=100057425052347" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1877F2] transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="mailto:academyshubharambha52@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <a href="/admission">
            <Button className="ml-1 bg-primary hover:bg-primary/90">Apply Now</Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-t animate-in slide-in-from-top-2">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <a
                key={link.path}
                href={link.path}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </a>
            ))}
            <a href="/admission" className="mt-2 text-center">
              <Button className="w-full bg-primary hover:bg-primary/90">Apply Now</Button>
            </a>
            <div className="flex items-center justify-center gap-6 pt-4 pb-2 mt-2 border-t">
              <a href="https://www.facebook.com/profile.php?id=100057425052347" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1877F2] transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="mailto:academyshubharambha52@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
