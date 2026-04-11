import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

export const ReviewForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("parent");
  const [quote, setQuote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("testimonials").insert([{ name, role, quote }]);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to submit", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your review has been submitted and will appear after approval." });
      setName("");
      setQuote("");
      setRole("parent");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="review-name">Your Name</Label>
          <Input id="review-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Ram Sharma" />
        </div>
        <div>
          <Label htmlFor="review-role">You are a</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="review-quote">Your Review</Label>
        <Textarea id="review-quote" value={quote} onChange={(e) => setQuote(e.target.value)} required placeholder="Share your experience with Shubharambha Academy..." rows={4} />
      </div>
      <Button type="submit" disabled={loading} className="gap-2">
        <Send className="h-4 w-4" /> {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};
