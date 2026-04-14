import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Calendar, UploadCloud, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type NewsForm = { title: string; description: string; news_date: string; image_url: string };
const emptyForm: NewsForm = { title: "", description: "", news_date: "", image_url: "" };

const AdminNews = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setForm(p => ({ ...p, image_url: "" }));
    } else {
      toast({ title: "Please drop a valid image file", variant: "destructive" });
    }
  };

  const { data: newsItems, isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data } = await supabase.from("news").select("*").order("news_date", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let finalImageUrl = form.image_url;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('events')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const newsData = { ...form, image_url: finalImageUrl };

      if (editId) {
        const { error } = await supabase.from("news").update(newsData).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert([newsData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-news"] });
      setDialogOpen(false);
      setForm(emptyForm);
      setFile(null);
      setEditId(null);
      toast({ title: editId ? "News updated" : "News created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("news").delete().eq("id", item.id);
      if (error) throw error;

      if (item.image_url && item.image_url.includes("supabase.co")) {
        const parts = item.image_url.split("/");
        const fileName = parts.pop();
        if (fileName) {
          await supabase.storage.from("events").remove([fileName]);
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-news"] });
      toast({ title: "News deleted" });
    },
  });

  const openEdit = (newsItem: typeof newsItems extends (infer T)[] ? T : never) => {
    setEditId(newsItem.id);
    setForm({ title: newsItem.title, description: newsItem.description || "", news_date: newsItem.news_date, image_url: newsItem.image_url || "" });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">Manage News</h2>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm(emptyForm); setFile(null); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add News</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? "Edit News" : "Create News"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
                <div><Label>Date</Label><Input type="date" value={form.news_date} onChange={e => setForm(p => ({ ...p, news_date: e.target.value }))} required /></div>
                <div className="space-y-2">
                  <Label>News Image (optional)</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    {file ? (
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-left">
                          <p className="text-sm font-medium">{file.name}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-primary/10 text-primary p-2 rounded-full mb-1">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-1">Drag & drop an image</p>
                        <Input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          id="event-file-upload"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setFile(e.target.files[0]);
                              setForm(p => ({ ...p, image_url: "" }));
                            }
                          }}
                        />
                        <Label htmlFor="event-file-upload" className="cursor-pointer">
                          <div className="inline-flex h-7 items-center justify-center rounded border border-input bg-background px-3 text-[11px] font-medium hover:bg-accent">
                            Browse
                          </div>
                        </Label>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">OR ENTER URL</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <Input 
                    value={form.image_url} 
                    onChange={e => {
                      setForm(p => ({ ...p, image_url: e.target.value }));
                      if (e.target.value) setFile(null);
                    }} 
                    placeholder="https://..." 
                    disabled={!!file}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : editId ? "Update News" : "Create News"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? <p>Loading...</p> : newsItems && newsItems.length > 0 ? (
          <div className="space-y-3">
            {newsItems.map(newsItem => (
              <Card key={newsItem.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{newsItem.title}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(newsItem.news_date), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(newsItem)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete news item?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(newsItem)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : <p className="text-muted-foreground">No news yet.</p>}
      </div>
    </AdminLayout>
  );
};

export default AdminNews;
