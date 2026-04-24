import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { deleteStorageFile } from "@/utils/storage-helpers";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, UploadCloud, X, Save, Link as LinkIcon, Eye } from "lucide-react";

const AdminPopup = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["admin-popup-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_stats").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (stats) {
      setImageUrl(stats.find(s => s.key === "popup_image_url")?.value || "");
      setLinkUrl(stats.find(s => s.key === "popup_link_url")?.value || "");
      setIsActive(stats.find(s => s.key === "popup_active")?.value === "true");
    }
  }, [stats]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { imageUrl: string; linkUrl: string; isActive: boolean }) => {
      const updates = [
        { key: "popup_image_url", value: payload.imageUrl },
        { key: "popup_link_url", value: payload.linkUrl },
        { key: "popup_active", value: payload.isActive.toString() },
      ];

      for (const u of updates) {
        const { error } = await supabase.from("site_stats")
          .upsert({ key: u.key, value: u.value }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-popup-stats"] });
      toast({ title: "Popup settings saved successfully!" });
      setIsUploading(false);
      setFile(null);
    },
    onError: (err: any) => {
      toast({ title: "Failed to save settings", description: err.message, variant: "destructive" });
      setIsUploading(false);
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = imageUrl;

    if (file) {
      try {
        // Delete old image if it exists and is a Supabase image
        const oldImageUrl = stats?.find(s => s.key === "popup_image_url")?.value;
        if (oldImageUrl) {
          await deleteStorageFile(oldImageUrl, "gallery");
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `popup-${Math.random()}.${fileExt}`;
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

    saveMutation.mutate({ imageUrl: finalImageUrl, linkUrl, isActive });
  };

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

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-display font-bold mb-6">Popup Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="popup-active" className="text-base font-semibold">Enable Popup</Label>
                    <Switch 
                      id="popup-active" 
                      checked={isActive} 
                      onCheckedChange={setIsActive} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Popup Image</Label>
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
                            <ImagePlus className="w-5 h-5" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Drag & drop or click to upload</p>
                          <Input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            id="popup-file-upload"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFile(e.target.files[0]);
                                setImageUrl("");
                              }
                            }}
                          />
                          <Label htmlFor="popup-file-upload" className="cursor-pointer">
                            <div className="text-xs text-primary hover:underline">Browse files</div>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-url">Or Image URL</Label>
                    <Input 
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        if (e.target.value) setFile(null);
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!file}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link-url" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" /> Destination Link
                    </Label>
                    <Input 
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="/admission or https://..."
                    />
                    <p className="text-[10px] text-muted-foreground">The page where users will go when they click the popup.</p>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={saveMutation.isPending || isUploading}>
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending || isUploading ? "Saving..." : "Save Popup Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Live Preview</span>
            </div>
            <div className="relative aspect-[4/5] bg-black/5 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden group">
              {(file || imageUrl) ? (
                <div className="relative max-w-[80%] w-full shadow-2xl rounded-lg overflow-hidden animate-in zoom-in-95 duration-300">
                   <img 
                    src={file ? URL.createObjectURL(file) : imageUrl} 
                    alt="Popup Preview" 
                    className="w-full h-auto object-contain bg-white"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              ) : (
                <div className="text-center p-8">
                  <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-sm text-muted-foreground">Upload an image to see the preview</p>
                </div>
              )}
            </div>
            <p className="text-xs text-center text-muted-foreground italic">
              This is how the popup will look on the home page.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPopup;
