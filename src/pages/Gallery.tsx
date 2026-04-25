import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageIcon, X } from "lucide-react";

const Gallery = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <PublicLayout>
      <section className="relative mt-16 md:mt-20 min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner py-8 sm:py-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/gallery-banner.png')` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white drop-shadow-md">
              Photo <span className="text-primary-foreground drop-shadow-lg">Gallery</span>
            </h1>
            <p className="text-white/90 text-center mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg drop-shadow px-2 sm:px-0">
              Glimpses of life at Shubharambha Academy — our events, classrooms, and campus.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <ScrollReveal key={img.id} delay={i * 0.05}>
                  <div
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => setSelected(img.image_url)}
                  >
                    <img
                      src={img.image_url}
                      alt={img.caption || "Gallery image"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {img.caption && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-sm">{img.caption}</span>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Gallery photos will be added soon.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          {selected && (
            <div className="relative">
              <img src={selected} alt="Gallery preview" className="w-full rounded-lg" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default Gallery;
