import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, GraduationCap, MessageSquare, TrendingUp, Star, Mail } from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { data: admissions } = useQuery({
    queryKey: ["admin-admissions-count"],
    queryFn: async () => {
      const { data } = await supabase.from("admissions").select("id, student_name, class, status, created_at").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const { data: events } = useQuery({
    queryKey: ["admin-events-count"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id");
      return data || [];
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["admin-messages-count"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("id");
      return data || [];
    },
  });

  const { data: recentMessages } = useQuery({
    queryKey: ["admin-recent-messages"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("id, name, email, created_at").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const { data: recentReviews } = useQuery({
    queryKey: ["admin-recent-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("id, name, role, created_at").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const totalAdmissions = admissions?.length || 0;

  const stats = [
    { icon: GraduationCap, label: "Admissions", value: totalAdmissions.toString(), color: "text-primary" },
    { icon: Calendar, label: "Events", value: (events?.length || 0).toString(), color: "text-gold" },
    { icon: MessageSquare, label: "Messages", value: (messages?.length || 0).toString(), color: "text-green-600" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Recent Admissions
              </h2>
              {admissions && admissions.length > 0 ? (
                <div className="space-y-3">
                  {admissions.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="truncate pr-2">
                        <p className="font-medium truncate">{a.student_name}</p>
                        <p className="text-sm text-muted-foreground">{a.class}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${a.status === 'contacted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(a.created_at), "MMM d")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No admissions yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Recent Messages
              </h2>
              {recentMessages && recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="truncate pr-2">
                        <p className="font-medium truncate">{m.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{m.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{format(new Date(m.created_at), "MMM d")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent messages.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-gold" /> Recent Reviews
              </h2>
              {recentReviews && recentReviews.length > 0 ? (
                <div className="space-y-3">
                  {recentReviews.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="truncate pr-2">
                        <p className="font-medium truncate">{r.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{r.role}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent reviews.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
