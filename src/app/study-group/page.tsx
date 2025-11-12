"use client";

import DocLayout from "@/components/doc-layout";
import { Users, BookOpen, Calendar, MessageSquare, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudyGroupPage() {
  const activeGroups = [
    {
      name: "LeetCode Daily Challenge",
      topic: "Algorithm Practice",
      members: [
        { name: "Alex", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
        { name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
        { name: "Mike", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      ],
      memberCount: 12,
      schedule: "Daily, 8:00 PM",
      level: "All Levels",
      status: "Open",
    },
    {
      name: "System Design Study Circle",
      topic: "System Design",
      members: [
        { name: "Emily", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
        { name: "James", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      ],
      memberCount: 8,
      schedule: "Tue & Thu, 7:00 PM",
      level: "Advanced",
      status: "Open",
    },
    {
      name: "JavaScript Deep Dive",
      topic: "Web Development",
      members: [
        { name: "Lisa", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop" },
        { name: "Tom", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
        { name: "Nina", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
      ],
      memberCount: 10,
      schedule: "Mon & Wed, 6:30 PM",
      level: "Intermediate",
      status: "Full",
    },
    {
      name: "React Mastery Group",
      topic: "Frontend Development",
      members: [
        { name: "David", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop" },
        { name: "Sophie", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop" },
      ],
      memberCount: 7,
      schedule: "Saturday, 10:00 AM",
      level: "Intermediate",
      status: "Open",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Learn faster by studying with peers who share your goals and interests.",
    },
    {
      icon: Target,
      title: "Accountability",
      description: "Stay motivated and on track with regular group check-ins and shared goals.",
    },
    {
      icon: MessageSquare,
      title: "Knowledge Sharing",
      description: "Benefit from diverse perspectives and explanations from group members.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your growth and celebrate milestones with your study partners.",
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "All Levels":
        return "bg-green-500";
      case "Intermediate":
        return "bg-blue-500";
      case "Advanced":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Open" ? "bg-green-500" : "bg-gray-500";
  };

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Study Groups</h1>
          <p className="text-lg text-muted-foreground">
            Join or create study groups to learn together, stay accountable, and achieve your goals faster. Connect with peers who share your learning interests and objectives.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Active Study Groups</h2>
            <Button>Create New Group</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {activeGroups.map((group, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getLevelColor(group.level)}>
                          {group.level}
                        </Badge>
                        <Badge className={getStatusColor(group.status)}>
                          {group.status}
                        </Badge>
                      </div>
                      <CardDescription>{group.topic}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{group.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {group.memberCount} members
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {group.members.map((member, idx) => (
                          <Avatar key={idx} className="w-8 h-8 border-2 border-background">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {group.memberCount > group.members.length && (
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                            +{group.memberCount - group.members.length}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      disabled={group.status === "Full"}
                    >
                      {group.status === "Open" ? "Join Group" : "Join Waitlist"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">How Study Groups Work</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold">Find or Create</h3>
              <p className="text-sm text-muted-foreground">
                Join an existing group or create your own based on your learning goals.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold">Set Goals</h3>
              <p className="text-sm text-muted-foreground">
                Agree on study schedules, topics, and milestones with your group.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold">Study Together</h3>
              <p className="text-sm text-muted-foreground">
                Meet regularly via video calls or in-person to learn and discuss.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                4
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor achievements and celebrate milestones as a group.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Study Group Features</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Private group chat and discussion forums</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Shared resources and study materials</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Video conferencing integration</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Calendar scheduling and reminders</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Progress tracking and goal management</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Collaborative document editing</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Code sharing and review tools</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Achievement badges and recognition</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Browse All Groups</Button>
          <Button size="lg" variant="outline">Create Study Group</Button>
        </div>
      </div>
    </DocLayout>
  );
}
