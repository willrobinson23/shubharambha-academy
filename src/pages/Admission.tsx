import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const classes = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8",
  "Class 9"
];

const Admission = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    student_name: "", parent_name: "", class: "", phone: "", email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_name.trim() || !form.parent_name.trim() || !form.class || !form.phone.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("admissions").insert([form]);
    setLoading(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <PublicLayout>
        <section className="pt-28 pb-20 min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4 text-center max-w-md">
            <ScrollReveal>
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-display font-bold mb-4">Application Submitted!</h1>
              <p className="text-muted-foreground mb-2">
                Thank you for applying to Shubharambha Academy. We have received your admission form.
              </p>
              <p className="text-muted-foreground">
                Our team will contact you within 2-3 business days.
              </p>
              <Button className="mt-8" onClick={() => { setSuccess(false); setForm({ student_name: "", parent_name: "", class: "", phone: "", email: "" }); }}>
                Submit Another Application
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="relative mt-16 md:mt-20 min-h-[40vh] flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/admission-banner.png')` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white drop-shadow-md">
              <span className="text-primary-foreground drop-shadow-lg">Admission</span> Application
            </h1>
            <p className="text-white/90 text-center mt-4 max-w-2xl mx-auto text-lg drop-shadow">
              Admissions are open for the academic year 2083. Fill out the form below and our team will reach out to you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <ScrollReveal>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">Admission Form</h2>
                    <p className="text-sm text-muted-foreground">Academic Year 2083</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="student_name">Student's Full Name *</Label>
                    <Input id="student_name" value={form.student_name} onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))} placeholder="Enter student's name" maxLength={100} />
                  </div>
                  <div>
                    <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
                    <Input id="parent_name" value={form.parent_name} onChange={e => setForm(p => ({ ...p, parent_name: e.target.value }))} placeholder="Enter parent's name" maxLength={100} />
                  </div>
                  <div>
                    <Label>Applying for Class *</Label>
                    <Select value={form.class} onValueChange={v => setForm(p => ({ ...p, class: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+977-98XXXXXXXX" maxLength={20} />
                  </div>
                  <div>
                    <Label htmlFor="adm_email">Student's / Guardian's Email Address *</Label>
                    <Input id="adm_email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" maxLength={255} />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    <GraduationCap className="h-4 w-4" /> {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Admission;
