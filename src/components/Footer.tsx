import { useState } from "react";
import { GraduationCap, Phone, Mail, MapPin, Facebook, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDownload = () => {
    setShowDialog(false);
    const link = document.createElement("a");
    link.href = "/ShubharambhaSchool.apk";
    link.download = "ShubharambhaSchool.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-7 w-7 text-gold" />
              <span className="font-display text-xl font-bold">Shubharambha Academy</span>
            </div>
            <p className="text-sm opacity-75 leading-relaxed mb-6">
              Nurturing young minds with quality education, strong values, and a commitment to excellence since 2052 B.S.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/profile.php?id=100057425052347" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:opacity-100 opacity-75 transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:academyshubharambha52@gmail.com" className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-white hover:opacity-100 opacity-75 transition-all">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-75">
              {[
                { label: "About Us", path: "/about" },
                { label: "Academics", path: "/academics" },
                { label: "Events", path: "/events" },
                { label: "Gallery", path: "/gallery" },
                { label: "Contact", path: "/contact" },
              ].map(l => (
                <li key={l.path}>
                  <a href={l.path} className="hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-gold">Programs</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>Nursery</li>
              <li>Primary School (1-5)</li>
              <li>Middle School (6-8)</li>
              <li>Secondary School (9-10)</li>
              <li>Higher Secondary (+2) (Coming Soon)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-gold">Contact Info</h4>
            <ul className="space-y-3 text-sm opacity-75">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Ratnanagar-10, Harihar Tole, Chitwan, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+977 9855066668 / 9855077668</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>academyshubharambha52@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile-only Download App Button */}
        <div className="block md:hidden mt-8">
          <button
            id="download-app-btn"
            onClick={() => setShowDialog(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            Download School App
          </button>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Shubharambha Academy. All rights reserved.
        </div>
      </div>

      {/* Teacher Verification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-[calc(100%-2.5rem)] max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-2 sm:mb-3 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <DialogTitle className="text-lg sm:text-xl">Teacher Access Only</DialogTitle>
            <DialogDescription className="text-sm sm:text-base mt-2">
              This app is exclusively for teachers of Shubharambha Academy. Are you a teacher?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 sm:flex-col mt-2">
            <Button
              id="confirm-teacher-btn"
              onClick={handleDownload}
              className="w-full py-3 text-sm sm:text-base h-auto whitespace-normal bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-md"
            >
              Yes, I am a teacher of Shubharambha Academy
            </Button>
            <Button
              id="decline-teacher-btn"
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="w-full py-3 text-sm sm:text-base"
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  );
};
