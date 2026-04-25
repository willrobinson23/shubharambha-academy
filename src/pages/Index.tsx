import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ReviewForm } from "@/components/ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PublicLayout } from "@/components/PublicLayout";
import {
  GraduationCap, Users, Award, Clock, FlaskConical, Bus,
  BookOpen, Shield, Quote, Calendar, ArrowRight, X
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const AnimatedCounter = ({ target, label, icon: Icon }: { target: number; label: string; icon?: any }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 20);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="flex justify-center py-3 sm:py-6 px-4 sm:px-12 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md shadow-lg hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-4">
        {Icon && <Icon className="h-6 w-6 sm:h-10 sm:w-10 text-primary-foreground/90 stroke-[2]" />}
        <div className="flex flex-col items-start">
          <div className="text-xl flex items-baseline sm:text-4xl md:text-5xl font-bold text-primary-foreground font-display leading-none">
            {count}<span className="text-lg sm:text-3xl ml-0.5 sm:ml-1 leading-none">+</span>
          </div>
          <div className="text-primary-foreground/90 mt-0.5 sm:mt-1 font-medium text-xs sm:text-base whitespace-nowrap">{label}</div>
        </div>
      </div>
    </div>
  );
};

const whyChooseUs = [
  { icon: FlaskConical, title: "Modern Labs", desc: "State-of-the-art science and computer labs for hands-on learning." },
  { icon: Bus, title: "Safe Transport", desc: "GPS-enabled buses covering all major routes across Chitwan." },
  { icon: BookOpen, title: "Expert Faculty", desc: "Highly qualified and experienced teachers dedicated to student success." },
  { icon: Shield, title: "Safe Environment", desc: "CCTV-monitored campus with a focus on child safety and well-being." },
  { icon: Award, title: "Top Results", desc: "Consistently outstanding SEE results and national-level achievements." },
  { icon: Users, title: "Adjusted Class Sizes", desc: "Personalized attention with an optimal teacher-to-student ratio." },
];

const heroImages = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
  "/hero5.jpg"
];

const Index = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 800);
    return () => clearTimeout(popupTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["site-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("site_stats").select("*");
      return data || [];
    },
  });

  const { data: events } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true }).limit(3);
      return data || [];
    },
  });

  const { data: latestNews } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("news_date", { ascending: false }).limit(3);
      if (error && error.code !== "42P01") throw error;
      return data || [];
    },
  });

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").eq("approved", true);
      return data || [];
    },
  });

  const { data: topAchievers } = useQuery({
    queryKey: ["top-achievers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("achievers").select("*").order("created_at", { ascending: false });
      if (error && error.code !== "42P01") throw error; // Handle if table not created yet
      return data || [];
    },
  });

  const getStat = (key: string) => {
    const s = stats?.find(s => s.key === key);
    return s ? s.value : "";
  };

  const getStatInt = (key: string) => {
    const val = getStat(key);
    return val ? parseInt(val) : 0;
  };

  const popupActive = getStat("popup_active") === "true";
  const popupImageUrl = getStat("popup_image_url");
  const popupLinkUrl = getStat("popup_link_url");

  return (
    <PublicLayout>
      {/* Dynamic Advertisement Popup Overlay */}
      {showPopup && popupActive && popupImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative max-w-2xl w-full animate-in zoom-in-95 fade-in duration-300">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-3 -right-3 md:-top-5 md:-right-5 z-10 bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X className="h-5 w-5" />
            </button>
            <div
              className="rounded-xl overflow-hidden shadow-2xl cursor-pointer ring-4 ring-primary/20 hover:ring-primary/50 transition-all duration-300"
              onClick={() => {
                if (popupLinkUrl) {
                  if (popupLinkUrl.startsWith('http')) {
                    window.open(popupLinkUrl, '_blank');
                  } else {
                    navigate(popupLinkUrl);
                  }
                }
              }}
            >
              <img src={popupImageUrl} alt="Advertisement" className="w-full h-auto object-contain bg-white" />
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[85vh] flex items-center mt-16 md:mt-20 pt-10 sm:pt-16 pb-10 sm:pb-16 overflow-hidden bg-zinc-900">
        {/* Background Slide Carousel */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentBg * (100 / heroImages.length)}%)`, width: `${heroImages.length * 100}%` }}
        >
          {heroImages.map((img) => (
            <div
              key={img}
              className="relative h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${img}')`, width: `${100 / heroImages.length}%` }}
            />
          ))}
        </div>
        {/* Dark overlay to make text readable without mix-blend-multiply which breaks stacking */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl px-1 sm:px-0">
            <ScrollReveal>
              <span className="inline-block bg-gold/90 text-black font-semibold text-[11px] px-2.5 py-1 sm:text-sm sm:px-4 sm:py-1.5 rounded-full mb-3 md:mb-6 shadow-lg">
                📚 Admission Open 2083 | +2 Rolling out soon
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h2 className="text-[11px] sm:text-sm md:text-xl lg:text-3xl font-display font-medium mb-2 sm:mb-4 text-white/90 drop-shadow-md">
                Previously known as{" "}
                <span className="bg-gradient-to-r from-yellow-200 via-sky-200 to-gold bg-[length:200%_auto] text-transparent bg-clip-text animate-gradient-x font-bold drop-shadow-[0_2px_15px_rgba(255,215,0,0.4)]">
                  Lyceum International Model School
                </span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="text-[22px] sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-tight drop-shadow-md">
                Where Every Child's{" "}
                <span className="text-primary-foreground drop-shadow-lg">Journey</span>{" "}
                <span className="text-gold drop-shadow-lg">Begins</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mt-3 sm:mt-6 text-[13px] sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow">
                At Shubharambha Academy, we believe every child deserves a strong foundation.
                Join a community where curiosity thrives, values are nurtured, and futures are built.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 mt-4 sm:mt-8">
                <Link to="/admission">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-lg px-5 flex items-center justify-center sm:px-8 gap-2 shadow-lg h-10 sm:h-11">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" /> Apply Now
                  </Button>
                </Link>
                <a href="https://shubharambhateacherdashboard.netlify.app/#/guardianLogin" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-5 sm:px-8 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg h-10 sm:h-11">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5" /> Guardian's Portal
                  </Button>
                </a>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-lg px-5 sm:px-8 flex items-center justify-center bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm h-10 sm:h-11">
                    Visit School
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-16 bg-yellow-500 text-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 max-w-6xl mx-auto">
            <AnimatedCounter target={getStatInt("students")} label="Students" icon={Users} />
            <AnimatedCounter target={getStatInt("teachers")} label="Teachers" icon={BookOpen} />
            <AnimatedCounter target={getStatInt("years")} label="Years" icon={Clock} />
            <AnimatedCounter target={getStatInt("programs")} label="Class Programs" icon={GraduationCap} />
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <ScrollReveal className="flex-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20 hover:border-primary/50 transition-colors duration-500 group">
                <img
                  src="/hero1.jpg"
                  alt="Welcome to Shubharambha Academy"
                  className="w-full h-full object-cover aspect-square md:aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </ScrollReveal>

            <div className="flex-1 space-y-6">
              <ScrollReveal delay={0.1}>
                <h2 className="text-xl sm:text-4xl md:text-5xl font-display font-bold">
                  Welcome to <br />
                  <span className="text-primary text-2xl sm:text-5xl md:text-6xl">Shubharambha</span> Academy
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-lg">
                  Providing a nurturing environment for your child's holistic development since our inception.
                  We believe in building confident, responsible, and capable leaders of tomorrow through
                  innovative learning and strong moral foundations.
                </p>
                <div className="mt-8 flex gap-4">
                  <Link to="/about">
                    <Button variant="outline" className="gap-2">
                      <BookOpen className="h-4 w-4" /> Discover Our History
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Why Choose <span className="text-primary">Shubharambha</span>?</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                We provide a comprehensive learning environment that prepares students for a bright future.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Us */}
      <section className="py-12 sm:py-20 bg-zinc-950/5">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Explore <span className="text-primary">Us</span></h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Take a glimpse into our vibrant campus life, academic excellence, and student activities.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 relative bg-black aspect-video group">
              <video
                src="/video1.mp4"
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                poster="/hero1.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Events */}
      {events && events.length > 0 && (
        <section className="py-12 sm:py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Upcoming <span className="text-primary">Events</span></h2>
                  <p className="text-muted-foreground mt-2">Stay updated with our latest activities and programs.</p>
                </div>
                <Link to="/events" className="hidden md:block">
                  <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <ScrollReveal key={event.id} delay={i * 0.1}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {event.image_url ? (
                      <div className="h-48 overflow-hidden shrink-0">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                        <Calendar className="h-12 w-12 text-primary/50" />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                        {format(new Date(event.event_date), "MMMM d, yyyy")}
                      </span>
                      <h3 className="text-lg font-display font-semibold mt-2">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{event.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
            <Link to="/events" className="md:hidden mt-6 block">
              <Button variant="outline" className="w-full gap-2">View All Events <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      )}

      {/* Latest News */}
      {latestNews && latestNews.length > 0 && (
        <section className="py-12 sm:py-20 bg-background border-t border-border/50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Latest <span className="text-primary">News</span></h2>
                  <p className="text-muted-foreground mt-2">Catch up on our recent announcements and stories.</p>
                </div>
                <Link to="/news" className="hidden md:block">
                  <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.1}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border-border/50">
                    {item.image_url ? (
                      <div className="h-48 overflow-hidden shrink-0">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center shrink-0">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                        {format(new Date(item.news_date), "MMMM d, yyyy")}
                      </span>
                      <h3 className="text-lg font-display font-semibold mt-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{item.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
            <Link to="/news" className="md:hidden mt-6 block">
              <Button variant="outline" className="w-full gap-2">View All News <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      )}

      {/* Top Achievers */}
      {topAchievers && topAchievers.length > 0 && (
        <section className="py-12 sm:py-20 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Our Recent Top <span className="text-primary">Achievers</span></h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Celebrating the outstanding academic success of our brilliant students.</p>
              </div>
            </ScrollReveal>
            <div className="max-w-6xl mx-auto relative">
              <Carousel
                opts={{ align: "center", loop: topAchievers.length > 4, breakpoints: { '(max-width: 767px)': { containScroll: false } } }}
                className="w-full"
              >
                <CarouselContent className={topAchievers.length < 4 ? "md:justify-center -ml-2 md:-ml-4" : "-ml-2 md:-ml-4"}>
                  {topAchievers.map((achiever, i) => (
                    <CarouselItem key={achiever.id} className="pl-2 md:pl-4 basis-[70%] md:basis-1/2 lg:basis-1/4">
                      <ScrollReveal delay={Math.min(i, 4) * 0.1} className="h-full">
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50 flex flex-col">
                          <div className="aspect-square md:aspect-[4/5] w-full overflow-hidden bg-muted relative shrink-0">
                            {achiever.image_url ? (
                              <img src={achiever.image_url} alt={achiever.name} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center bg-primary/10 text-primary">
                                <GraduationCap className="h-16 w-16 mb-2 opacity-50" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5 text-center flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-lg font-display truncate">{achiever.name}</h3>
                              <p className="text-sm text-primary font-medium mt-1 truncate">{achiever.passed_class}</p>
                            </div>
                            <div className="mt-4">
                              <span className="bg-gold/15 text-gold font-bold inline-block px-4 py-1.5 rounded-full text-sm">
                                GPA: {achiever.gpa}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {topAchievers.length > 4 && (
                  <>
                    <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
                    <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-12 sm:py-20 bg-background overflow-hidden relative">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">What Parents & Students <span className="text-gold">Say</span></h2>
              </div>
            </ScrollReveal>

            <div className="max-w-6xl mx-auto relative">
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {testimonials.map((t, i) => (
                    <CarouselItem key={t.id} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                      <ScrollReveal delay={Math.min(i, 3) * 0.1} className="h-full">
                        <Card className="hover:shadow-xl transition-shadow duration-300 h-full border-border/50">
                          <CardContent className="p-6 md:p-8 flex flex-col h-full">
                            <Quote className="h-10 w-10 text-gold/30 mb-4 shrink-0" />
                            <p className="text-muted-foreground italic leading-relaxed text-sm sm:text-lg">"{t.quote}"</p>
                            <div className="mt-3 pt-3 md:mt-6 md:pt-6 border-t flex items-center justify-between shrink-0">
                              <div>
                                <p className="font-semibold text-foreground text-base sm:text-lg">{t.name}</p>
                                <p className="text-sm text-primary font-medium capitalize mt-0.5">{t.role}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {testimonials.length > 3 && (
                  <div className="hidden md:block">
                    <CarouselPrevious className="-left-16 h-12 w-12 border-2 hover:bg-primary hover:text-white" />
                    <CarouselNext className="-right-16 h-12 w-12 border-2 hover:bg-primary hover:text-white" />
                  </div>
                )}
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* Submit a Review */}
      <section className="py-12 sm:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Share Your <span className="text-primary">Experience</span></h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Are you a parent, student, or alumni? We'd love to hear from you.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ReviewForm />
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-20 bg-yellow-500 text-black">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Ready to Start Your Child's Journey?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
              Admissions are now open for the academic year 2083. Secure your child's spot today.
            </p>
            <Link to="/admission">
              <Button size="lg" className="mt-8 bg-background text-primary hover:bg-background/90 text-lg px-10 gap-2">
                <GraduationCap className="h-5 w-5" /> Apply for Admission
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
