import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export const StickyAdmissionCTA = () => (
  <div className="fixed bottom-6 right-6 z-40 md:hidden">
    <Link to="/admission">
      <Button size="lg" className="rounded-full shadow-xl bg-primary hover:bg-primary/90 gap-2">
        <GraduationCap className="h-5 w-5" />
        Apply Now
      </Button>
    </Link>
  </div>
);
