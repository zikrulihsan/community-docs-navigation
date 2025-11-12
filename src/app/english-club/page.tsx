"use client";

import DocLayout from "@/components/doc-layout";
import { MessageCircle, Video, BookOpen, Users, Globe, Mic } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EnglishClubPage() {
  const sessions = [
    {
      title: "Casual Conversation Circle",
      day: "Every Monday",
      time: "7:00 PM - 8:00 PM",
      level: "All Levels",
      participants: "8-12",
      format: "Discussion",
    },
    {
      title: "Tech Talk Practice",
      day: "Every Wednesday",
      time: "6:30 PM - 7:30 PM",
      level: "Intermediate",
      participants: "6-10",
      format: "Presentations",
    },
    {
      title: "Interview English",
      day: "Every Friday",
      time: "8:00 PM - 9:00 PM",
      level: "Advanced",
      participants: "5-8",
      format: "Role-play",
    },
  ];

  const topics = [
    "Technical Presentations",
    "Code Reviews in English",
    "Professional Communication",
    "Meeting Participation",
    "Email Writing",
    "Networking Conversations",
    "Interview Practice",
    "Tech News Discussion",
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

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">English Club</h1>
          <p className="text-lg text-muted-foreground">
            Improve your English communication skills in a supportive tech-focused environment. Practice speaking, listening, and professional communication with fellow developers and engineers.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Practice Speaking</CardTitle>
              <CardDescription>
                Regular conversation practice in small groups focused on tech topics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Tech-Focused Content</CardTitle>
              <CardDescription>
                Learn technical vocabulary and professional communication for software development.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Supportive Community</CardTitle>
              <CardDescription>
                Practice in a judgment-free environment with peers learning together.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Regular Sessions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <Badge className={getLevelColor(session.level)}>
                      {session.level}
                    </Badge>
                  </div>
                  <CardDescription>{session.format}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-muted-foreground" />
                        <span>{session.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{session.participants} participants</span>
                      </div>
                    </div>
                    <Button className="w-full">Join Session</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">What We Cover</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-background rounded-lg"
              >
                <Mic className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Access curated materials for improving technical English
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Technical vocabulary lists and flashcards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Sample presentations and talks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Professional email templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Interview question practice guides</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Session Format</CardTitle>
              <CardDescription>
                How our English Club sessions are structured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Warm-up icebreaker activities (10 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Main topic discussion or practice (40 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Feedback and tips sharing (10 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>All sessions recorded for review</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Why Join English Club?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Improve confidence in technical communication</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Prepare for international job opportunities</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Practice interview and presentation skills</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Network with English-speaking developers</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Learn industry-specific terminology</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Build professional communication skills</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Join Next Session</Button>
          <Button size="lg" variant="outline">View Resources</Button>
        </div>
      </div>
    </DocLayout>
  );
}
