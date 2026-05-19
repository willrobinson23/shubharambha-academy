import { GraduationCap, Phone, Mail, MapPin, Facebook, Download } from "lucide-react";

export const Footer = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/app-normal-release.apk"; // Path to your APK file in the public folder
    link.download = "app-normal-release.apk"; // Path to your APK file in the public folder
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSoftwareDownload = () => {
    const link = document.createElement("a");
    link.href = "/Shubharambha Software Setup.exe"; // Path to your software executable file
    link.download = "Shubharambha Software Setup.exe"; 
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
              <span className="font-display text-lg sm:text-xl font-bold">Shubharambha Academy</span>
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
              <li>Higher Secondary (+2) (Rolling out soon)</li>
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
                <span className="break-all sm:break-normal">academyshubharambha52@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile-only Download App Button */}
        <div className="block md:hidden mt-8">
          <button
            id="download-app-btn"
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            Download School App
          </button>
        </div>

        {/* Desktop-only Download Software Button */}
        <div className="hidden md:flex justify-center mt-8">
          <button
            id="download-software-btn"
            onClick={handleSoftwareDownload}
            className="w-full max-w-md flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            Download School Software
          </button>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Shubharambha Academy. All rights reserved.
        </div>
      </div>

    </footer>
  );
};
