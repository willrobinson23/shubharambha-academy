
-- Add approved column
ALTER TABLE public.testimonials ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- Drop old public select policy and replace with approved-only
DROP POLICY IF EXISTS "Testimonials are publicly readable" ON public.testimonials;
CREATE POLICY "Only approved testimonials are publicly readable" ON public.testimonials
  FOR SELECT TO public
  USING (approved = true);

-- Allow anyone to submit a testimonial
CREATE POLICY "Anyone can submit testimonial" ON public.testimonials
  FOR INSERT TO public
  WITH CHECK (true);
