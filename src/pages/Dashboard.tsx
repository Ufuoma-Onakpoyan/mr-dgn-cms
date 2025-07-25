import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, Eye, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { data: blogStats } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: async () => {
      const [published, draft, total] = await Promise.all([
        supabase.from('blog_posts').select('*', { count: 'exact' }).eq('published', true),
        supabase.from('blog_posts').select('*', { count: 'exact' }).eq('published', false),
        supabase.from('blog_posts').select('*', { count: 'exact' })
      ]);
      
      return {
        published: published.count || 0,
        draft: draft.count || 0,
        total: total.count || 0
      };
    }
  });

  const { data: portfolioStats } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: async () => {
      const [published, draft, total] = await Promise.all([
        supabase.from('portfolio').select('*', { count: 'exact' }).eq('published', true),
        supabase.from('portfolio').select('*', { count: 'exact' }).eq('published', false),
        supabase.from('portfolio').select('*', { count: 'exact' })
      ]);
      
      return {
        published: published.count || 0,
        draft: draft.count || 0,
        total: total.count || 0
      };
    }
  });

  const stats = [
    {
      title: 'Published Blog Posts',
      value: blogStats?.published || 0,
      description: `${blogStats?.draft || 0} drafts`,
      icon: FileText,
      color: 'text-primary'
    },
    {
      title: 'Portfolio Items',
      value: portfolioStats?.published || 0,
      description: `${portfolioStats?.draft || 0} drafts`,
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      title: 'Total Content',
      value: (blogStats?.total || 0) + (portfolioStats?.total || 0),
      description: 'All items',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'This Month',
      value: new Date().getDate(),
      description: 'Days elapsed',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to MrDgn Entertainment Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">Create New Blog Post</span>
              </div>
              <a 
                href="/blog/new" 
                className="text-sm text-primary hover:underline"
              >
                Create →
              </a>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Add Portfolio Item</span>
              </div>
              <a 
                href="/portfolio/new" 
                className="text-sm text-primary hover:underline"
              >
                Create →
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Activity tracking coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;