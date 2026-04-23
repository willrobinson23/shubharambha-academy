import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, BookOpen, GraduationCap, FlaskConical, Library, Dumbbell } from "lucide-react";

const programs = [
  { icon: Baby, title: "Nursery", grades: "Ages 3-5", desc: "A nurturing start with play-based learning, creativity, and social development." },
  { icon: BookOpen, title: "Pre Primary School", grades: "Class LKG - UKG", desc: "Building strong foundations in reading, writing, math, and critical thinking." },
  { icon: BookOpen, title: "Primary School", grades: "Class 1-5", desc: "Building strong foundations in reading, writing, math, and critical thinking." },
  { icon: GraduationCap, title: "Middle School", grades: "Class 6-8", desc: "Expanding horizons with science, social studies, and extracurricular activities." },
  { icon: GraduationCap, title: "Secondary School", grades: "Class 9-10 (SEE)", desc: "Intensive preparation for the SEE examinations with focused subject training." },
  { icon: GraduationCap, title: "Higher Secondary (+2) (Rolling out soon)", grades: "Class 11-12", desc: "Science and Management streams with career-focused education and guidance." },
];

const facilities = [
  { icon: FlaskConical, title: "Science Labs", desc: "Fully equipped physics, chemistry, and biology labs for practical experiments." },
  { icon: Library, title: "Library", desc: "A vast collection of textbooks, reference materials, newspapers, and digital resources." },
  { icon: Dumbbell, title: "Sports Facilities", desc: "Football ground, basketball court, indoor games, and regular sports training programs." },
];

const Academics = () => (
  <PublicLayout>
    <section className="relative mt-16 md:mt-20 min-h-[40vh] flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/hero4.jpg')` }} />
      <div className="absolute inset-0 bg-black/60" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white drop-shadow-md">
            Academic <span className="text-primary-foreground drop-shadow-lg">Programs</span>
          </h1>
          <p className="text-white/90 mt-4 max-w-2xl mx-auto text-lg drop-shadow">
            From early childhood to higher secondary, we offer a comprehensive curriculum designed to develop well-rounded individuals.
          </p>
        </ScrollReveal>
      </div>
    </section>

    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          {programs.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="p-6 flex items-start gap-5">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <p.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-display font-semibold">{p.title}</h3>
                      <span className="text-xs bg-gold/10 text-gold font-semibold px-3 py-1 rounded-full">{p.grades}</span>
                    </div>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Our <span className="text-gold">Facilities</span>
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {facilities.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1}>
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="h-14 w-14 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                    <f.icon className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default Academics;
