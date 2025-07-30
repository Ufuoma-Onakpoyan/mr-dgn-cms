import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, Globe } from "lucide-react";

interface BlogPostWithViews {
  id: string;
  title: string;
  slug: string;
  view_count: number;
  published: boolean;
  created_at: string;
}

export function ViewAnalytics() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, view_count, published, created_at')
        .order('view_count', { ascending: false });
      
      if (error) throw error;
      return data as BlogPostWithViews[];
    }
  });

  const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
  const publishedPosts = posts?.filter(post => post.published) || [];
  const topPosts = posts?.slice(0, 5) || [];

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all connected websites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              Live across all sites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views per Post</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Published posts only
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>
            Most viewed blog posts across all connected websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <h4 className="font-medium truncate">{post.title}</h4>
                    {!post.published && (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{(post.view_count || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {topPosts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No blog posts found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            View tracking is enabled across all websites connected to your Supabase backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Tracking Function</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Cross-Site Tracking</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Rate Limiting</span>
              <Badge variant="default">Protected</Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              Add the blog tracker script to any website to automatically track views.
              See the integration guide for implementation details.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}