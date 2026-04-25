import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const News = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: newsItems, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await supabase.from("news").select("*").order("news_date", { ascending: false });
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
              School <span className="text-primary-foreground drop-shadow-lg">News</span>
            </h1>
            <p className="text-white/90 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg drop-shadow px-2 sm:px-0">
              Stay updated with all our latest announcements, stories, and achievements.
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
          ) : newsItems && newsItems.length > 0 ? (
            <div className="space-y-6">
              {newsItems.map((newsItem, i) => (
                <ScrollReveal key={newsItem.id} delay={i * 0.08}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="md:flex h-full">
                      {newsItem.image_url ? (
                        <div 
                          className="h-56 md:h-auto md:w-72 shrink-0 overflow-hidden bg-muted relative cursor-pointer"
                          onClick={() => setSelectedImage(newsItem.image_url)}
                        >
                          <img src={newsItem.image_url} alt={newsItem.title} className="md:absolute md:inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="h-56 md:h-auto md:w-72 shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                          <Calendar className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                      <CardContent className="p-6 flex-1">
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                          {format(new Date(newsItem.news_date), "MMMM d, yyyy")}
                        </span>
                        <h3 className="text-xl font-display font-semibold mt-1">{newsItem.title}</h3>
                        <p className="text-muted-foreground mt-2">{newsItem.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No news available at the moment. Check back soon!</p>
          )}
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent 
          className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-transparent border-none shadow-none"
          closeClassName="right-4 top-4 bg-yellow-500 opacity-100 hover:opacity-90 hover:bg-yellow-400 text-black border-2 border-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
        >
          {selectedImage && (
            <img src={selectedImage} alt="News Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default News;
