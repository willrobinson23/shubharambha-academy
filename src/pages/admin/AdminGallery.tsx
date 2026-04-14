import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ImagePlus, UploadCloud, X } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminGallery = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
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

  const { data: images, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const addImageMutation = useMutation({
    mutationFn: async (urlToSave: string) => {
      const { error } = await supabase.from("gallery_images").insert([
        { image_url: urlToSave, caption: caption }
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Image added to gallery!" });
      setImageUrl("");
      setFile(null);
      setCaption("");
      setIsUploading(false);
    },
    onError: (err) => {
      toast({ title: "Failed to add image", description: err.message, variant: "destructive" });
      setIsUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", item.id);
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
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Image removed from gallery!" });
    },
    onError: (err) => {
      toast({ title: "Failed to delete image", description: err.message, variant: "destructive" });
    }
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() && !file) {
      toast({ title: "Please provide an image URL or upload a file.", variant: "destructive" });
      return;
    }

    let finalImageUrl = imageUrl;

    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
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

    addImageMutation.mutate(finalImageUrl);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold mb-6">Manage Gallery</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImagePlus className="h-5 w-5" /> Add New Image
          </h2>
          <form onSubmit={handleAdd} className="space-y-6">
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
                    <ImagePlus className="w-6 h-6" />
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

            <div className="grid md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Annual Sports Day 2024"
                />
              </div>
            </div>
            <Button type="submit" disabled={addImageMutation.isPending || isUploading}>
              {addImageMutation.isPending || isUploading ? "Adding..." : "Add to Gallery"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground">Loading gallery...</p>
      ) : !images?.length ? (
        <p className="text-muted-foreground">No images in the gallery yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative">
              <img
                src={img.image_url}
                alt={img.caption || "Gallery"}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the image from the public gallery forever.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(img)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {img.caption && (
                  <p className="text-white text-sm font-medium drop-shadow-md">
                    {img.caption}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;
