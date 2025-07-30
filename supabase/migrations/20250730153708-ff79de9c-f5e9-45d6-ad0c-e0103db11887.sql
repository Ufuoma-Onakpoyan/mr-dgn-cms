-- Update blog post timestamps to reflect realistic publishing intervals
-- Spread the 5 recent blog posts across different dates

UPDATE blog_posts 
SET 
  created_at = '2024-12-15 10:00:00+00',
  published_at = CASE WHEN published = true THEN '2024-12-15 10:00:00+00' ELSE published_at END
WHERE title = 'MrDGN Group: A Comprehensive Look at Nigeria''s Rising Conglomerate';

UPDATE blog_posts 
SET 
  created_at = '2024-12-20 14:30:00+00',
  published_at = CASE WHEN published = true THEN '2024-12-20 14:30:00+00' ELSE published_at END
WHERE title = 'Building Excellence: How MrDGN Construction is Transforming Delta State''s Infrastructure';

UPDATE blog_posts 
SET 
  created_at = '2024-12-25 09:15:00+00',
  published_at = CASE WHEN published = true THEN '2024-12-25 09:15:00+00' ELSE published_at END
WHERE title = 'Luxury Real Estate Redefined: Mansaluxe Realty''s Impact on Abuja''s Property Market';

UPDATE blog_posts 
SET 
  created_at = '2024-12-28 16:45:00+00',
  published_at = CASE WHEN published = true THEN '2024-12-28 16:45:00+00' ELSE published_at END
WHERE title = 'The Synergy Effect: How MrDGN Group Companies Work Together for Success';

UPDATE blog_posts 
SET 
  created_at = '2025-01-02 11:20:00+00',
  published_at = CASE WHEN published = true THEN '2025-01-02 11:20:00+00' ELSE published_at END
WHERE title = 'Innovation in Nigerian Business: Lessons from MrDGN Group''s Growth Strategy';