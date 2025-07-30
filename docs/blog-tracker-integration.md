# MrDGN Blog View Tracker Integration Guide

The MrDGN Blog View Tracker is a centralized view counting system that works across all websites connected to the MrDGN Group Supabase backend.

## Quick Start

### Option 1: Simple Script Include (Recommended)

Add this script tag to your website's `<head>` or before the closing `</body>` tag:

```html
<script src="https://your-domain.com/blog-tracker.js"></script>
```

That's it! The tracker will automatically detect blog posts and track views.

## Advanced Configuration

### Manual Slug Specification

If the automatic slug detection doesn't work for your URL structure, specify the blog slug manually:

```html
<!-- Add this data attribute to any element on your blog post page -->
<article data-blog-slug="your-blog-post-slug">
  <!-- Your blog content -->
</article>
```

### Website Identification

To help with analytics, add a meta tag to identify your website:

```html
<meta name="mrdgn-website-id" content="your-website-name">
```

### Manual Tracking

For single-page applications or custom implementations:

```javascript
// Track the current page
MrDGNBlogTracker.track();

// Track a specific slug
MrDGNBlogTracker.trackSlug('specific-blog-slug');

// Disable tracking
MrDGNBlogTracker.disable();

// Re-enable tracking
MrDGNBlogTracker.enable();
```

## Supported URL Patterns

The tracker automatically detects blog slugs from these URL patterns:

- `/blog/slug-name`
- `/posts/slug-name`  
- `/articles/slug-name`
- `/slug-name` (root level)

## Features

- **Automatic Detection**: Detects blog posts from URL patterns or data attributes
- **Unique View Tracking**: Prevents double-counting within the same session
- **Rate Limiting**: Built-in protection against abuse
- **Cross-Site Support**: Works across multiple websites with the same backend
- **Retry Logic**: Automatically retries failed requests
- **Development Mode**: Automatically disabled on localhost

## WordPress Integration

For WordPress sites, add this to your theme's `functions.php`:

```php
function add_mrdgn_tracker() {
    if (is_single() && get_post_type() == 'post') {
        $slug = get_post_field('post_name');
        echo '<div data-blog-slug="' . esc_attr($slug) . '"></div>';
    }
    wp_enqueue_script('mrdgn-tracker', 'https://your-domain.com/blog-tracker.js', array(), '1.0', true);
}
add_action('wp_footer', 'add_mrdgn_tracker');
```

## Next.js/React Integration

```jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function BlogPost({ slug }) {
  useEffect(() => {
    // Load the tracker script
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/blog-tracker.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <article data-blog-slug={slug}>
      {/* Your blog content */}
    </article>
  );
}
```

## Analytics Dashboard

View analytics for all connected websites in your admin dashboard at `/blog` in your main application.

## Troubleshooting

### Views Not Being Tracked

1. Check browser console for error messages
2. Verify the blog slug is being detected correctly
3. Ensure the script is loading properly
4. Check that you're not in development mode (localhost)

### Rate Limiting

The system allows 10 requests per minute per client to prevent abuse. If you're hitting rate limits, check for:

- Duplicate script includes
- Automatic page refreshes
- Multiple tracking calls

## Support

For technical support or questions about the tracker integration, contact the MrDGN Group development team.