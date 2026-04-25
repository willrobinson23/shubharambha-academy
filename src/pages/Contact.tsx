import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <PublicLayout>
      <section className="relative mt-16 md:mt-20 min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner py-8 sm:py-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/contact-banner.png')` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white drop-shadow-md">
              Get in <span className="text-primary-foreground drop-shadow-lg">Touch</span>
            </h1>
            <p className="text-white/90 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg drop-shadow px-2 sm:px-0">
              Have questions? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-display font-bold mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter your full name" maxLength={100} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" maxLength={255} />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="How can we help you?" rows={5} maxLength={1000} />
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                      <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-display font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      {[
                        { icon: MapPin, label: "Address", value: "Ratnanagar-10, Harihar Tole, Chitwan, Nepal" },
                        { icon: Phone, label: "Phone", value: "+977 9855066668 / 9855077668" },
                        { icon: Mail, label: "Email", value: "academyshubharambha52@gmail.com" },
                        { icon: Clock, label: "Office Hours", value: "Sun-Fri: 10:00 AM - 4:00 PM" },
                      ].map(c => (
                        <div key={c.label} className="flex items-start gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                            <c.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{c.label}</p>
                            <p className="text-sm text-muted-foreground">{c.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    <iframe
                      src="https://maps.google.com/maps?width=100%25&height=256&hl=en&q=27.625928,84.5016077+(Shubharambha%20Academy)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                      width="100%"
                      height="256"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Shubharambha Academy Location"
                    ></iframe>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Contact;
