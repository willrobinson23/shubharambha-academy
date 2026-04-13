import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, BookOpen, Trophy, Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { color } from "framer-motion";

const About = () => {
  const [showDashboardDialog, setShowDashboardDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleDashboardLogin = () => {
    if (password === "LIMS123") {
      window.open("https://shubharambhateacherdashboard.netlify.app", "_blank");
      setShowDashboardDialog(false);
      setPassword("");
      setErrorText("");
    } else {
      setErrorText("Incorrect password. Please try again.");
    }
  };

  const { data: teamMembers, isLoading: loadingTeam } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: supportStaff, isLoading: loadingSupport } = useQuery({
    queryKey: ["support_staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_staff")
        .select("*")
        .order("created_at", { ascending: true });
      // If table doesnt exist yet, ignore error
      if (error && error.code !== "42P01") throw error;
      return data || [];
    },
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative mt-16 md:mt-20 min-h-[40vh] flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/hero6.png')` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white drop-shadow-md">
                About <span className="text-primary-foreground drop-shadow-lg">Shubharambha</span> Academy
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-white/95 drop-shadow-md mt-1">
                Previously known as <span className="text-primary-foreground drop-shadow-lg" style={{ color: "yellow" }}>Lyceum International Model School</span>
              </h2>
              <p className="text-white/90 mt-2 max-w-2xl mx-auto text-sm sm:text-base drop-shadow">
                Established in 2052 B.S., Shubharambha Academy has been a beacon of quality education in Chitwan,
                nurturing generations of confident, compassionate, and capable leaders.
              </p>
              <div className="mt-4 flex flex-col items-center justify-center space-y-1.5">
                <span className="text-white/90 text-[10px] sm:text-xs font-medium uppercase tracking-wider bg-black/40 px-2.5 py-0.5 rounded-full border border-white/20">For Teachers Only</span>
                <Button onClick={() => setShowDashboardDialog(true)} className="font-semibold px-6 py-1 h-8 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  Teacher's Dashboard
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Dialog open={showDashboardDialog} onOpenChange={(open) => {
        setShowDashboardDialog(open);
        if (!open) {
          setPassword("");
          setErrorText("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Teacher's Dashboard Access</DialogTitle>
            <DialogDescription>
              Please enter the secure password to access the teacher's dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorText) setErrorText("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDashboardLogin();
                }
              }}
            />
            {errorText && <p className="text-destructive text-sm font-medium">{errorText}</p>}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowDashboardDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDashboardLogin}>
              Enter Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 max-w-4xl">
          <ScrollReveal>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide a holistic, student-centered education that empowers young minds with
                  knowledge, critical thinking, and moral values — preparing them to excel in a
                  rapidly changing world while staying rooted in Nepali culture and traditions.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <Eye className="h-7 w-7 text-gold" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted educational institution in Nepal, recognized for academic
                  excellence, character development, and producing future leaders who contribute
                  positively to society and the nation.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Leadership Messages */}
      {/* Leadership Messages */}
      <section className="py-12 sm:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-col gap-16">
            {/* Principal */}
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold mb-6">Principal's Message</h2>
                <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-primary/20 shadow-lg">
                  <img src="/principal.jpeg" alt="Principal" className="h-full w-full object-cover object-top" />
                </div>
                <blockquote className="text-lg text-muted-foreground italic leading-relaxed">
                  "Education is not just about books and exams — it is about building character,
                  fostering curiosity, and empowering every child to discover their unique potential.
                  At Shubharambha Academy, we are committed to creating an environment where every
                  student feels valued, inspired, and ready to take on the world."
                </blockquote>
                <p className="mt-6 font-semibold text-foreground text-xl">Mr. Pashupati Sharma Upadhyay</p>
                <p className="text-primary font-medium">Principal, Shubharambha Academy</p>
              </div>
            </ScrollReveal>

            <div className="h-px bg-border/50 max-w-md mx-auto w-full" />

            {/* Vice Principal */}
            <ScrollReveal delay={0.1}>
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold mb-6">Vice Principal's Message</h2>
                <div className="h-40 w-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-primary/20 shadow-lg">
                  <img src="/viceprincipal-1.jpeg" alt="Vice Principal" className="h-full w-full object-cover object-top" />
                </div>
                <blockquote className="text-lg text-muted-foreground italic leading-relaxed">
                  "शिक्षा केवल किताबी ज्ञानमा मात्र सीमित छैन, यो असल चरित्र निर्माण र अनुशासनको मार्ग पनि हो।
                  शुभारम्भ एकेडेमीमा हामी विद्यार्थीहरूको सर्वाङ्गीण विकासका लागि सदैव कटिबद्ध छौं। हाम्रा
                  विद्यार्थीहरू भोलिको दिनमा समाज र राष्ट्रको सक्षम नागरिक बनून् भन्ने हाम्रो मुख्य उद्देश्य हो।"
                </blockquote>
                <p className="mt-6 font-semibold text-foreground text-xl">Mrs. Bhima K Thapa</p>
                <p className="text-primary font-medium">Vice Principal, Shubharambha Academy</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold">Our <span className="text-primary">Teachers</span></h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Meet the dedicated professionals who work tirelessly to bring out the best in our students.
              </p>
            </div>
          </ScrollReveal>

          {loadingTeam ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg w-full" />
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="max-w-5xl mx-auto relative px-12 md:px-0">
              <Carousel
                opts={{ align: "start", loop: teamMembers.length >= 4 }}
                className="w-full"
              >
                <CarouselContent className={`-ml-4 ${teamMembers.length < 4 ? 'justify-center' : ''}`}>
                  {teamMembers.map((member, i) => (
                    <CarouselItem key={member.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <ScrollReveal delay={Math.min(i, 4) * 0.1}>
                        <Card className="overflow-hidden group hover:shadow-xl transition-all border-border h-full">
                          <div className="aspect-[3/4] w-full overflow-hidden">
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-4 text-center bg-card">
                            <h3 className="font-semibold text-lg line-clamp-1">{member.name}</h3>
                            <p className="text-sm text-primary font-medium mt-1 line-clamp-1">{member.role}</p>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {teamMembers.length > 4 && (
                  <div className="hidden md:block">
                    <CarouselPrevious className="-left-16 h-12 w-12 border-2 hover:bg-primary hover:text-white" />
                    <CarouselNext className="-right-16 h-12 w-12 border-2 hover:bg-primary hover:text-white" />
                  </div>
                )}
              </Carousel>
            </div>
          ) : null}
        </div>
      </section>

      {/* Support Staff */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold">Our <span className="text-primary">Support Staff</span></h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                The backbone of our academy, ensuring a smooth and safe environment for our students.
              </p>
            </div>
          </ScrollReveal>

          {loadingSupport ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg w-full" />
              ))}
            </div>
          ) : supportStaff && supportStaff.length > 0 ? (
            <div className="max-w-5xl mx-auto relative px-12 md:px-0">
              <Carousel
                opts={{ align: "start", loop: supportStaff.length >= 4 }}
                className="w-full"
              >
                <CarouselContent className={`-ml-4 ${supportStaff.length < 4 ? 'justify-center' : ''}`}>
                  {supportStaff.map((member, i) => (
                    <CarouselItem key={member.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <ScrollReveal delay={Math.min(i, 4) * 0.1}>
                        <Card className="overflow-hidden group hover:shadow-xl transition-all border-border h-full">
                          <div className="aspect-[3/4] w-full overflow-hidden">
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-4 text-center bg-card">
                            <h3 className="font-semibold text-lg line-clamp-1">{member.name}</h3>
                            <p className="text-sm text-primary font-medium mt-1 line-clamp-1">{member.role}</p>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {supportStaff.length > 4 && (
                  <div className="hidden md:block">
                    <CarouselPrevious className="-left-16 h-12 w-12 border-2 hover:bg-primary hover:text-white" />
                    <CarouselNext className="-right-16 h-12 w-12 border-2 hover:bg-primary hover:text-white" />
                  </div>
                )}
              </Carousel>
            </div>
          ) : null}
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Our <span className="text-gold">Achievements</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Trophy, title: "SEE Results", desc: "Consistently 95%+ pass rate with multiple students scoring A+ in SEE examinations." },
              { icon: Award, title: "National Awards", desc: "Recognized as one of the best schools in Chitwan by the District Education Committee." },
              { icon: Medal, title: "Competitions", desc: "Winners of regional science fairs, quiz competitions, and inter-school sports tournaments." },
            ].map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 0.1}>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="h-14 w-14 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                      <a.icon className="h-7 w-7 text-gold" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">{a.title}</h3>
                    <p className="text-muted-foreground text-sm">{a.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
