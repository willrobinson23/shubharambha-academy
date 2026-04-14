import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Users, UploadCloud, X } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminSupportStaff = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      setImageUrl(""); // Clear URL if file is chosen
    } else {
      toast({ title: "Please drop a valid image file", variant: "destructive" });
    }
  };

  const { data: team, isLoading } = useQuery({
    queryKey: ["admin-support-staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_staff")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const addTeamMutation = useMutation({
    mutationFn: async (urlToSave: string) => {
      const { error } = await supabase.from("support_staff").insert([
        { name, role, image_url: urlToSave }
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-support-staff"] });
      toast({ title: "Support staff member added successfully!" });
      setName("");
      setRole("");
      setImageUrl("");
      setFile(null);
      setIsUploading(false);
    },
    onError: (err) => {
      toast({ title: "Failed to add support staff member", description: err.message, variant: "destructive" });
      setIsUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("support_staff").delete().eq("id", item.id);
      if (error) throw error;

      if (item.image_url && item.image_url.includes("supabase.co")) {
        const parts = item.image_url.split("/");
        const fileName = parts.pop();
        if (fileName) {
          await supabase.storage.from("gallery").remove([fileName]);
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-support-staff"] });
      toast({ title: "Support staff member removed!" });
    },
    onError: (err) => {
      toast({ title: "Failed to remove support staff member", description: err.message, variant: "destructive" });
    }
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      toast({ title: "Name and Role are required.", variant: "destructive" });
      return;
    }
    if (!imageUrl.trim() && !file) {
      toast({ title: "Please provide an image URL or upload a file.", variant: "destructive" });
      return;
    }

    let finalImageUrl = imageUrl;

    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `team_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // We can reuse the gallery bucket for team images, or the team bucket if it exists. Reusing gallery as per instruction context
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

    addTeamMutation.mutate(finalImageUrl);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold mb-6">Manage Support Staff</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" /> Add New Support Staff Member
          </h2>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hari Shrestha"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role / Position</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Science Teacher"
                  required
                />
              </div>
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 text-primary p-3 rounded-full mb-2">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold">Drag & drop an image here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
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
                    <div className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                      Browse Files
                    </div>
                  </Label>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">OR PROVIDE URL</span>
              <div className="h-px bg-border flex-1" />
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
                placeholder="e.g. https://example.com/image.jpg"
                disabled={!!file}
              />
            </div>
            
            <Button type="submit" disabled={addTeamMutation.isPending || isUploading}>
              {addTeamMutation.isPending || isUploading ? "Adding..." : "Add to Support Staff"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground">Loading support staff members...</p>
      ) : !team?.length ? (
        <p className="text-muted-foreground">No support staff members added yet.</p>
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
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end p-3">
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
                          This will remove them from the "Our Support Staff" section forever.
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
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSupportStaff;
