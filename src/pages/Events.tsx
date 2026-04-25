import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
      return data || [];
    },
  });

  return (
    <PublicLayout>
      <section className="relative mt-16 md:mt-20 min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner py-8 sm:py-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/hero3.jpg')` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white drop-shadow-md">
              School <span className="text-primary-foreground drop-shadow-lg">Events</span>
            </h1>
            <p className="text-white/90 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg drop-shadow px-2 sm:px-0">
              Stay updated with all our latest programs, celebrations, and activities.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-32" /></CardContent></Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event, i) => (
                <ScrollReveal key={event.id} delay={i * 0.08}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="md:flex h-full">
                      {event.image_url ? (
                        <div className="h-56 md:h-auto md:w-72 shrink-0 overflow-hidden bg-muted relative">
                          <img src={event.image_url} alt={event.title} className="md:absolute md:inset-0 w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-56 md:h-auto md:w-72 shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                          <Calendar className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                      <CardContent className="p-6 flex-1">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                          {format(new Date(event.event_date), "MMMM d, yyyy")}
                        </span>
                        <h3 className="text-xl font-display font-semibold mt-1">{event.title}</h3>
                        <p className="text-muted-foreground mt-2">{event.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No events scheduled at the moment. Check back soon!</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default Events;
