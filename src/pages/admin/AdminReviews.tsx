import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Quote } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminReviews = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").update({ approved: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: "Review approved" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast({ title: "Review deleted" });
    },
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold mb-6">Manage Reviews</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !reviews?.length ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                <Quote className="h-6 w-6 text-gold/40 shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground italic">"{r.quote}"</p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="font-semibold text-foreground">{r.name}</span>
                    <span className="text-muted-foreground capitalize">{r.role}</span>
                    <span className="text-muted-foreground">
                      {format(new Date(r.created_at), "MMM d, yyyy")}
                    </span>
                    {r.approved ? (
                      <Badge variant="default" className="bg-green-600">Approved</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-green-600 border-green-600/30 hover:bg-green-50"
                      onClick={() => approveMutation.mutate(r.id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(r.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviews;
