import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Users, GraduationCap, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [students, setStudents] = useState("");
  const [teachers, setTeachers] = useState("");
  const [years, setYears] = useState("");
  const [programs, setPrograms] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("site_stats").select("*");
      return data || [];
    },
  });

  useEffect(() => {
    if (stats) {
      setStudents(stats.find(s => s.key === "students")?.value || "");
      setTeachers(stats.find(s => s.key === "teachers")?.value || "");
      setYears(stats.find(s => s.key === "years")?.value || "");
      setPrograms(stats.find(s => s.key === "programs")?.value || "");
    }
  }, [stats]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = [
        { key: "students", value: students },
        { key: "teachers", value: teachers },
        { key: "years", value: years },
        { key: "programs", value: programs },
      ];
      for (const u of updates) {
        // Upsert based on the unique key constraint to freely create the 'programs' key if it doesn't exist
        const { error } = await supabase.from("site_stats")
          .upsert({ key: u.key, value: u.value }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Settings saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-md">
        <h2 className="text-xl font-display font-bold">Site Settings</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Homepage Stats</h3>
            <div>
              <Label className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-primary" /> Total Students</Label>
              <Input value={students} onChange={e => setStudents(e.target.value)} placeholder="1200" />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1"><GraduationCap className="h-4 w-4 text-primary" /> Total Teachers</Label>
              <Input value={teachers} onChange={e => setTeachers(e.target.value)} placeholder="85" />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-primary" /> Years of Excellence</Label>
              <Input value={years} onChange={e => setYears(e.target.value)} placeholder="18" />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-1"><GraduationCap className="h-4 w-4 text-primary" /> Class Programs</Label>
              <Input value={programs} onChange={e => setPrograms(e.target.value)} placeholder="15" />
            </div>
            <Button onClick={() => saveMutation.mutate()} className="w-full gap-2" disabled={saveMutation.isPending}>
              <Save className="h-4 w-4" /> {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
