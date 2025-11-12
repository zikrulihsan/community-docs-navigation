"use client";

import DocLayout from "@/components/doc-layout";
import { Code, Database, Network, Cpu, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CSFundamentalPage() {
  const topics = [
    {
      title: "Data Structures",
      icon: Database,
      description: "Arrays, Linked Lists, Trees, Graphs, Hash Tables, and more",
      sessions: 8,
      difficulty: "Intermediate",
    },
    {
      title: "Algorithms",
      icon: Code,
      description: "Sorting, Searching, Dynamic Programming, Graph Algorithms",
      sessions: 10,
      difficulty: "Intermediate",
    },
    {
      title: "System Design",
      icon: Network,
      description: "Scalability, Load Balancing, Caching, Microservices",
      sessions: 6,
      difficulty: "Advanced",
    },
    {
      title: "Operating Systems",
      icon: Cpu,
      description: "Processes, Threads, Memory Management, File Systems",
      sessions: 7,
      difficulty: "Intermediate",
    },
    {
      title: "Computer Networks",
      icon: Network,
      description: "TCP/IP, HTTP, DNS, Network Protocols, Security",
      sessions: 5,
      difficulty: "Beginner",
    },
    {
      title: "Database Systems",
      icon: Database,
      description: "SQL, NoSQL, Transactions, Indexing, Query Optimization",
      sessions: 6,
      difficulty: "Intermediate",
    },
  ];

  const upcomingSessions = [
    {
      topic: "Binary Trees and BST",
      date: "Nov 16, 2025",
      time: "7:00 PM - 9:00 PM",
      instructor: "Dr. Sarah Chen",
      enrolled: 42,
      maxCapacity: 50,
    },
    {
      topic: "Dynamic Programming Patterns",
      date: "Nov 19, 2025",
      time: "6:30 PM - 8:30 PM",
      instructor: "Prof. Mike Rodriguez",
      enrolled: 38,
      maxCapacity: 45,
    },
    {
      topic: "System Design Fundamentals",
      date: "Nov 21, 2025",
      time: "8:00 PM - 10:00 PM",
      instructor: "Alex Kumar",
      enrolled: 35,
      maxCapacity: 40,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
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
          <h1 className="text-4xl font-bold tracking-tight">CS Fundamental Sessions</h1>
          <p className="text-lg text-muted-foreground">
            Master computer science fundamentals through interactive sessions, practical exercises, and hands-on problem solving. Build a strong foundation for technical interviews and career growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Comprehensive Coverage</CardTitle>
              <CardDescription>
                In-depth exploration of core CS concepts with real-world applications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Hands-on Practice</CardTitle>
              <CardDescription>
                Solve problems and implement concepts during live coding sessions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Expert Instructors</CardTitle>
              <CardDescription>
                Learn from experienced engineers and computer science educators.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{session.topic}</CardTitle>
                      <CardDescription>
                        Instructor: {session.instructor}
                      </CardDescription>
                    </div>
                    <Button>Register</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {session.enrolled}/{session.maxCapacity} enrolled
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Core Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <CardTitle>{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {topic.sessions} sessions
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Session Structure</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Theory Introduction</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear explanation of concepts with visual aids and examples (30 min)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Live Coding Demo</h3>
                  <p className="text-sm text-muted-foreground">
                    Implementation walkthrough with best practices (40 min)
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Practice Problems</h3>
                  <p className="text-sm text-muted-foreground">
                    Hands-on problem solving with guided support (40 min)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Q&A and Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Discussion, questions, and key takeaways (10 min)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">What You'll Gain</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Strong foundation in computer science fundamentals</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Improved problem-solving and analytical skills</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Preparation for technical interviews</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Access to recorded sessions and practice materials</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Certificate of completion for each topic</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Community support and study groups</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Browse All Sessions</Button>
          <Button size="lg" variant="outline">View Schedule</Button>
        </div>
      </div>
    </DocLayout>
  );
}
