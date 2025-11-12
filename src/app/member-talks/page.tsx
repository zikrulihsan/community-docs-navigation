"use client";

import DocLayout from "@/components/doc-layout";
import { Mic, Video, Calendar, Clock, Eye, Download, Play, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MemberTalksPage() {
  const upcomingSessions = [
    {
      title: "Building Scalable Microservices with Node.js",
      speaker: {
        name: "Alex Chen",
        role: "Senior Backend Engineer at TechCorp",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      },
      date: "Nov 18, 2025",
      time: "7:00 PM - 8:30 PM",
      duration: "90 minutes",
      description: "Learn how to design and implement scalable microservices architecture using Node.js, Docker, and Kubernetes.",
      topics: ["Microservices", "Node.js", "Docker", "Kubernetes"],
      registrations: 87,
      status: "Upcoming",
    },
    {
      title: "Modern React Patterns and Best Practices",
      speaker: {
        name: "Sarah Kim",
        role: "Frontend Tech Lead at StartupXYZ",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      },
      date: "Nov 22, 2025",
      time: "6:30 PM - 8:00 PM",
      duration: "90 minutes",
      description: "Explore advanced React patterns including custom hooks, compound components, and state management strategies.",
      topics: ["React", "Hooks", "State Management", "Performance"],
      registrations: 102,
      status: "Upcoming",
    },
    {
      title: "Career Transition: From Developer to Engineering Manager",
      speaker: {
        name: "Mike Rodriguez",
        role: "Engineering Manager at Global Tech",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      },
      date: "Nov 25, 2025",
      time: "8:00 PM - 9:00 PM",
      duration: "60 minutes",
      description: "A candid discussion about transitioning from an individual contributor to a people management role in tech.",
      topics: ["Career Growth", "Leadership", "Management", "Mentorship"],
      registrations: 65,
      status: "Upcoming",
    },
  ];

  const recordedSessions = [
    {
      title: "Introduction to System Design",
      speaker: {
        name: "Dr. Emily Chen",
        role: "Principal Engineer at CloudScale",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      },
      recordedDate: "Oct 28, 2025",
      duration: "2 hours",
      views: 1243,
      description: "A comprehensive introduction to system design principles, covering scalability, reliability, and performance.",
      topics: ["System Design", "Scalability", "Architecture", "Best Practices"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    },
    {
      title: "Machine Learning in Production",
      speaker: {
        name: "James Park",
        role: "ML Engineer at AI Innovations",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      },
      recordedDate: "Oct 15, 2025",
      duration: "90 minutes",
      views: 892,
      description: "Learn how to deploy and maintain machine learning models in production environments with real-world examples.",
      topics: ["Machine Learning", "MLOps", "Python", "Deployment"],
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    },
    {
      title: "Building Your Personal Brand as a Developer",
      speaker: {
        name: "Lisa Wang",
        role: "Developer Advocate at DevTools Inc",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
      },
      recordedDate: "Oct 5, 2025",
      duration: "75 minutes",
      views: 1567,
      description: "Tips and strategies for building your online presence, contributing to open source, and growing your career.",
      topics: ["Career", "Personal Branding", "Open Source", "Networking"],
      thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
    },
    {
      title: "Web Performance Optimization Techniques",
      speaker: {
        name: "Tom Anderson",
        role: "Performance Engineer at SpeedyWeb",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      },
      recordedDate: "Sep 20, 2025",
      duration: "2 hours",
      views: 2104,
      description: "Deep dive into web performance optimization, covering metrics, tools, and practical optimization strategies.",
      topics: ["Performance", "Web Vitals", "Optimization", "Frontend"],
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    },
    {
      title: "GraphQL: Beyond the Basics",
      speaker: {
        name: "Nina Patel",
        role: "API Architect at DataFlow",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      },
      recordedDate: "Sep 10, 2025",
      duration: "90 minutes",
      views: 756,
      description: "Advanced GraphQL concepts including schema design, performance optimization, and security best practices.",
      topics: ["GraphQL", "API Design", "Backend", "Architecture"],
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    },
    {
      title: "DevOps Best Practices for Small Teams",
      speaker: {
        name: "David Kim",
        role: "DevOps Lead at SmartOps",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
      },
      recordedDate: "Aug 28, 2025",
      duration: "60 minutes",
      views: 1320,
      description: "Practical DevOps strategies for small engineering teams, focusing on automation, monitoring, and CI/CD.",
      topics: ["DevOps", "CI/CD", "Automation", "Monitoring"],
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
    },
  ];

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Member Talks</h1>
          <p className="text-lg text-muted-foreground">
            Learn from our community members as they share their expertise, experiences, and insights. Join live sessions or watch recordings at your convenience.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Open to All Members: Everyone in the community can participate, ask questions, and share their knowledge!</span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Expert Speakers</CardTitle>
              <CardDescription>
                Learn from experienced members sharing real-world knowledge and insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Interactive Sessions</CardTitle>
              <CardDescription>
                Live Q&A and discussions with speakers during and after presentations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>On-Demand Access</CardTitle>
              <CardDescription>
                All sessions are recorded and available for members to watch anytime.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            <Button variant="outline">Propose a Talk</Button>
          </div>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={session.speaker.avatar} alt={session.speaker.name} />
                          <AvatarFallback>{session.speaker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{session.title}</CardTitle>
                          <div className="text-sm">
                            <p className="font-medium">{session.speaker.name}</p>
                            <p className="text-muted-foreground">{session.speaker.role}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500">
                          {session.status}
                        </Badge>
                      </div>

                      <CardDescription className="mb-3">
                        {session.description}
                      </CardDescription>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {session.topics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="lg:w-64 space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-muted-foreground" />
                          <span>{session.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{session.registrations} registered</span>
                        </div>
                      </div>
                      <Button className="w-full">Register Now</Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recorded Sessions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recorded Sessions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedSessions.map((session, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={session.thumbnail}
                    alt={session.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      Watch Now
                    </Button>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-black/70">
                    {session.duration}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{session.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.speaker.avatar} alt={session.speaker.name} />
                      <AvatarFallback>{session.speaker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-medium">{session.speaker.name}</p>
                      <p className="text-muted-foreground">{session.speaker.role}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-sm mb-3 line-clamp-2">
                    {session.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {session.topics.slice(0, 3).map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{session.views.toLocaleString()} views</span>
                    </div>
                    <span>{session.recordedDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="outline">Load More Recordings</Button>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Want to Give a Talk?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                <strong>All members can present!</strong> Share your knowledge with the community. We welcome talks on all tech topics including:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Technical deep dives and tutorials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Career advice and professional development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Project showcases and case studies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Industry trends and best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Lessons learned and personal experiences</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center">
              <div className="space-y-3 w-full">
                <p className="text-sm text-muted-foreground">
                  Whether you're a beginner or expert, your perspective matters! Submit your talk proposal and our community team will help you prepare and schedule your session.
                </p>
                <Button size="lg" className="w-full gap-2">
                  <Mic className="w-4 h-4" />
                  Submit Talk Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">View Full Schedule</Button>
          <Button size="lg" variant="outline">Browse All Recordings</Button>
        </div>
      </div>
    </DocLayout>
  );
}
