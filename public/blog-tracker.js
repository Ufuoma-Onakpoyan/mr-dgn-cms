/**
 * MrDGN Blog View Tracker
 * A lightweight JavaScript library for tracking blog post views across multiple websites
 * Connected to MrDGN Group's centralized Supabase backend
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiUrl: 'https://gpfjnnoabplgrsvhwbln.supabase.co/functions/v1/track-blog-view',
    storageKey: 'mrdgn_blog_views',
    sessionKey: 'mrdgn_session_views',
    retryAttempts: 3,
    retryDelay: 1000
  };

  // Generate or get unique client ID
  function getUniqueId() {
    let uniqueId = localStorage.getItem('mrdgn_client_id');
    if (!uniqueId) {
      uniqueId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mrdgn_client_id', uniqueId);
    }
    return uniqueId;
  }

  // Check if view was already tracked in this session
  function wasViewTracked(slug) {
    const sessionViews = JSON.parse(sessionStorage.getItem(CONFIG.sessionKey) || '[]');
    return sessionViews.includes(slug);
  }

  // Mark view as tracked in this session
  function markViewTracked(slug) {
    const sessionViews = JSON.parse(sessionStorage.getItem(CONFIG.sessionKey) || '[]');
    if (!sessionViews.includes(slug)) {
      sessionViews.push(slug);
      sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(sessionViews));
    }
  }

  // Extract blog slug from URL or data attribute
  function extractBlogSlug() {
    // Try to get slug from data attribute first
    const slugElement = document.querySelector('[data-blog-slug]');
    if (slugElement) {
      return slugElement.getAttribute('data-blog-slug');
    }

    // Try to extract from URL patterns
    const pathname = window.location.pathname;
    
    // Common blog URL patterns
    const patterns = [
      /\/blog\/([^\/]+)\/?$/,           // /blog/slug
      /\/posts\/([^\/]+)\/?$/,          // /posts/slug
      /\/articles\/([^\/]+)\/?$/,       // /articles/slug
      /\/([^\/]+)\/?$/                  // /slug (root level)
    ];

    for (const pattern of patterns) {
      const match = pathname.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  // Get website identifier
  function getWebsiteId() {
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="mrdgn-website-id"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }

    // Fallback to hostname
    return window.location.hostname;
  }

  // Send view tracking request with retry logic
  async function trackView(slug, website, uniqueId, attempt = 1) {
    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: slug,
          website: website,
          uniqueId: uniqueId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('MrDGN Blog Tracker: View tracked successfully', result);
      return result;

    } catch (error) {
      console.warn(`MrDGN Blog Tracker: Attempt ${attempt} failed:`, error.message);
      
      if (attempt < CONFIG.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay * attempt));
        return trackView(slug, website, uniqueId, attempt + 1);
      } else {
        console.error('MrDGN Blog Tracker: All retry attempts failed');
        throw error;
      }
    }
  }

  // Main tracking function
  async function initBlogTracker() {
    // Don't track in development or if explicitly disabled
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.mrdgnDisableTracking) {
      console.log('MrDGN Blog Tracker: Tracking disabled in development');
      return;
    }

    const slug = extractBlogSlug();
    if (!slug) {
      console.log('MrDGN Blog Tracker: No blog slug detected');
      return;
    }

    // Check if already tracked in this session
    if (wasViewTracked(slug)) {
      console.log('MrDGN Blog Tracker: View already tracked in this session');
      return;
    }

    const website = getWebsiteId();
    const uniqueId = getUniqueId();

    try {
      await trackView(slug, website, uniqueId);
      markViewTracked(slug);
    } catch (error) {
      console.error('MrDGN Blog Tracker: Failed to track view:', error);
    }
  }

  // Initialize tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogTracker);
  } else {
    initBlogTracker();
  }

  // Expose public API
  window.MrDGNBlogTracker = {
    track: initBlogTracker,
    trackSlug: function(slug) {
      const website = getWebsiteId();
      const uniqueId = getUniqueId();
      return trackView(slug, website, uniqueId);
    },
    disable: function() {
      window.mrdgnDisableTracking = true;
    },
    enable: function() {
      window.mrdgnDisableTracking = false;
    }
  };

})();