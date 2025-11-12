"use client";

import DocLayout from "@/components/doc-layout";
import { Users, MessageCircle, Calendar, Target, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GroupMentoringPage() {
  const activeGroups = [
    {
      name: "Frontend Masters Cohort",
      mentor: "Sarah Johnson",
      members: 8,
      maxMembers: 10,
      schedule: "Every Tuesday, 7:00 PM",
      duration: "8 weeks",
      focus: "React, Next.js, Advanced Patterns",
      status: "Open",
    },
    {
      name: "Backend Engineering Group",
      mentor: "Mike Chen",
      members: 10,
      maxMembers: 10,
      schedule: "Every Thursday, 6:30 PM",
      duration: "12 weeks",
      focus: "Node.js, PostgreSQL, System Design",
      status: "Full",
    },
    {
      name: "Career Acceleration Circle",
      mentor: "Alex Rodriguez",
      members: 6,
      maxMembers: 8,
      schedule: "Bi-weekly, Saturday 10:00 AM",
      duration: "6 weeks",
      focus: "Interview Prep, Career Strategy",
      status: "Open",
    },
  ];

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Group Mentoring</h1>
          <p className="text-lg text-muted-foreground">
            Learn together in small, focused groups with experienced mentors. Benefit from peer learning, diverse perspectives, and collaborative problem-solving.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Small Groups</CardTitle>
              <CardDescription>
                Join intimate groups of 6-10 members for personalized attention and meaningful connections.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Peer Learning</CardTitle>
              <CardDescription>
                Learn from both your mentor and peers, sharing experiences and solving problems together.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Structured Programs</CardTitle>
              <CardDescription>
                Follow a clear curriculum with milestones, projects, and accountability check-ins.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Active Mentoring Groups</h2>
          <div className="space-y-4">
            {activeGroups.map((group, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                        <Badge
                          className={
                            group.status === "Open"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {group.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Led by {group.mentor}
                      </CardDescription>
                    </div>
                    <Button disabled={group.status === "Full"}>
                      {group.status === "Open" ? "Join Group" : "Waitlist"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {group.members}/{group.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{group.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{group.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Structured</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Focus Areas:</p>
                      <p className="text-sm">{group.focus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Weekly Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Regular meetings with your mentor and group members to discuss progress and challenges.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Goal Setting</h3>
                  <p className="text-sm text-muted-foreground">
                    Set and track individual and group goals with mentor guidance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Project Work</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaborate on real-world projects to apply what you learn.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Private Discussion</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to a private channel for ongoing communication and support.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Peer Accountability</h3>
                  <p className="text-sm text-muted-foreground">
                    Stay motivated with support and accountability from your peers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Flexible Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Find a group that fits your schedule and time zone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Join a Group</Button>
          <Button size="lg" variant="outline">Lead a Group</Button>
        </div>
      </div>
    </DocLayout>
  );
}
