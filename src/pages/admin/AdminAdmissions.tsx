import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Phone, CheckCircle2, Mail } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminAdmissions = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: admissions, isLoading } = useQuery({
    queryKey: ["admin-admissions"],
    queryFn: async () => {
      const { data } = await supabase.from("admissions").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const markContacted = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admissions").update({ status: "contacted" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-admissions"] }); toast({ title: "Marked as contacted" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-admissions"] }); toast({ title: "Deleted" }); },
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold">Admission Applications</h2>
        <Card>
          <CardContent className="p-0">
            {isLoading ? <p className="p-6">Loading...</p> : admissions && admissions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admissions.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.student_name}</TableCell>
                        <TableCell>{a.parent_name}</TableCell>
                        <TableCell>{a.class}</TableCell>
                        <TableCell><span className="flex items-center gap-1"><Phone className="h-3 w-3" />{a.phone}</span></TableCell>
                        <TableCell>
                          {a.email && <span className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{a.email}</span>}
                          {!a.email && "-"}
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'contacted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {a.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{format(new Date(a.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {a.status !== "contacted" && (
                              <Button variant="ghost" size="icon" onClick={() => markContacted.mutate(a.id)} title="Mark contacted">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this application?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMutation.mutate(a.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : <p className="p-6 text-muted-foreground">No applications received yet.</p>}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAdmissions;
