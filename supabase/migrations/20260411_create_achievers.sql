-- Top Achievers table
CREATE TABLE public.achievers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  passed_class TEXT NOT NULL,
  gpa TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievers ENABLE ROW LEVEL SECURITY;

-- Apply policies
CREATE POLICY "Achievers are publicly readable" ON public.achievers FOR SELECT USING (true);
CREATE POLICY "Admins can insert achievers" ON public.achievers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update achievers" ON public.achievers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete achievers" ON public.achievers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
