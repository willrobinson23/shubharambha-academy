import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { deleteStorageFile } from "@/utils/storage-helpers";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Users, UploadCloud, X, Pencil, Plus } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminTeams = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      setImageUrl("");
    } else {
      toast({ title: "Please drop a valid image file", variant: "destructive" });
    }
  };

  const { data: team, isLoading } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      let finalImageUrl = imageUrl;

      if (file) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `team_${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(filePath);

          finalImageUrl = publicUrlData.publicUrl;
        } catch (error: any) {
          toast({ title: "Failed to upload image", description: error.message, variant: "destructive" });
          setIsUploading(false);
          return;
        }
      }

      const memberData = { name, role, image_url: finalImageUrl };

      if (editId) {
        const { error } = await supabase.from("team_members").update(memberData).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert([memberData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: editId ? "Team member updated successfully!" : "Team member added successfully!" });
      resetForm();
      setDialogOpen(false);
      setIsUploading(false);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setIsUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("team_members").delete().eq("id", item.id);
      if (error) throw error;
      await deleteStorageFile(item.image_url, "gallery");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-teams"] });
      toast({ title: "Team member removed!" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to remove team member", description: err.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setName("");
    setRole("");
    setImageUrl("");
    setFile(null);
    setEditId(null);
  };

  const handleOpenEdit = (member: any) => {
    setEditId(member.id);
    setName(member.name);
    setRole(member.role);
    setImageUrl(member.image_url);
    setFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      toast({ title: "Required fields missing", description: "Name and Role are required.", variant: "destructive" });
      return;
    }
    if (!imageUrl.trim() && !file) {
      toast({ title: "Image missing", description: "Please provide an image URL or upload a file.", variant: "destructive" });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Manage Teams</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) resetForm(); setDialogOpen(o); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Hari Shrestha"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role / Position</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Science Teacher"
                    required
                  />
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary/10 text-primary p-2 rounded-full mb-1">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold">Drag & drop or click to upload</p>
                    <Input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      id="file-upload"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFile(e.target.files[0]);
                          setImageUrl("");
                        }
                      }}
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-xs text-primary hover:underline">Browse from computer</span>
                    </Label>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">OR PROVIDE URL</span>
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!file}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={saveMutation.isPending || isUploading}>
                {saveMutation.isPending || isUploading ? "Saving..." : editId ? "Update Team Member" : "Add to Team"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading team members...</p>
      ) : !team?.length ? (
        <p className="text-muted-foreground">No team members added yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.id} className="overflow-hidden group relative flex flex-col">
              <div className="relative aspect-[3/4] w-full">
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end p-3 gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleOpenEdit(member)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {member.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove them from the "Our Teams" section forever.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(member)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="p-4 bg-background">
                <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                <p className="text-muted-foreground text-sm truncate">{member.role}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeams;
