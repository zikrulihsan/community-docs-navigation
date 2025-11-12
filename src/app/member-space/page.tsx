"use client";

import DocLayout from "@/components/doc-layout";
import { Users, MessageSquare, Calendar, FileText, Image, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MemberSpacePage() {
  const recentActivity = [
    {
      user: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      action: "shared a project",
      content: "Check out my new React dashboard!",
      time: "2 hours ago",
    },
    {
      user: "Sarah Kim",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      action: "posted in General",
      content: "Anyone interested in a study group for System Design?",
      time: "5 hours ago",
    },
    {
      user: "Mike Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      action: "completed a course",
      content: "Advanced TypeScript Patterns",
      time: "1 day ago",
    },
  ];

  const upcomingEvents = [
    {
      title: "Community Meetup",
      date: "Nov 15, 2025",
      time: "6:00 PM",
      attendees: 23,
    },
    {
      title: "Tech Talk: AI Trends",
      date: "Nov 18, 2025",
      time: "7:30 PM",
      attendees: 45,
    },
  ];

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Member Space</h1>
          <p className="text-lg text-muted-foreground">
            Your personal hub for community interaction, updates, and engagement. Connect with fellow members and stay updated with community activities.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Discussion Forums</CardTitle>
              <CardDescription>
                Join conversations on various topics with community members.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Shared Resources</CardTitle>
              <CardDescription>
                Access and share learning materials, code snippets, and projects.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Track your progress and celebrate milestones with the community.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>See what your community members are up to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold">{activity.user}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{activity.action}</p>
                        <p className="text-sm">{activity.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.date} at {event.time}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Start Discussion
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Image className="w-4 h-4" />
                    Share Project
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    Find Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Member Benefits</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Access to exclusive member-only content and resources</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Priority registration for events and workshops</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Direct messaging with other members</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Showcase your projects and portfolio</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Participate in community challenges and hackathons</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Recognition for contributions and achievements</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Go to Forums</Button>
          <Button size="lg" variant="outline">Browse Members</Button>
        </div>
      </div>
    </DocLayout>
  );
}
