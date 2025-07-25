-- Create portfolio table for managing portfolio content
CREATE TABLE public.portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT NOT NULL DEFAULT 'project',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio management
CREATE POLICY "Authenticated users can view all portfolio items" 
ON public.portfolio 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create portfolio items" 
ON public.portfolio 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update portfolio items" 
ON public.portfolio 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete portfolio items" 
ON public.portfolio 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Public can view published portfolio items
CREATE POLICY "Published portfolio items are viewable by everyone" 
ON public.portfolio 
FOR SELECT 
USING (published = true);

-- Create trigger for automatic timestamp updates on portfolio
CREATE TRIGGER update_portfolio_updated_at
BEFORE UPDATE ON public.portfolio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for setting published_at when publishing portfolio items
CREATE TRIGGER set_portfolio_published_at
BEFORE UPDATE ON public.portfolio
FOR EACH ROW
EXECUTE FUNCTION public.set_published_at();