"use client";

import { MapPin, Briefcase, Star, Clock, MessageSquare, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DocLayout from "@/components/doc-layout";

export default function MentorPage() {
  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      title: "Senior Software Engineer",
      company: "Tech Giants Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 127,
      sessions: 340,
      responseTime: "< 2 hours",
      location: "San Francisco, CA",
      expertise: ["React", "TypeScript", "System Design", "Career Growth"],
      bio: "15+ years of experience in software engineering. Passionate about mentoring and helping developers grow.",
      hourlyRate: 150,
      availability: "Available",
    },
    {
      id: 2,
      name: "Marcus Chen",
      title: "UX Design Lead",
      company: "Design Studio",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 89,
      sessions: 215,
      responseTime: "< 4 hours",
      location: "New York, NY",
      expertise: ["UI/UX Design", "Figma", "Design Systems", "User Research"],
      bio: "Award-winning designer with expertise in creating delightful user experiences for web and mobile.",
      hourlyRate: 120,
      availability: "Available",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      title: "Data Science Manager",
      company: "AI Solutions Corp",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5.0,
      reviews: 156,
      sessions: 428,
      responseTime: "< 1 hour",
      location: "Boston, MA",
      expertise: ["Machine Learning", "Python", "Data Analysis", "AI Strategy"],
      bio: "PhD in Computer Science. Specialized in machine learning and AI. Love teaching complex concepts simply.",
      hourlyRate: 180,
      availability: "Limited",
    },
    {
      id: 4,
      name: "James Anderson",
      title: "DevOps Architect",
      company: "Cloud Services Ltd",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 94,
      sessions: 267,
      responseTime: "< 3 hours",
      location: "Seattle, WA",
      expertise: ["AWS", "Kubernetes", "Docker", "CI/CD", "Infrastructure"],
      bio: "Cloud infrastructure expert with 12 years of experience. Certified AWS Solutions Architect.",
      hourlyRate: 140,
      availability: "Available",
    },
    {
      id: 5,
      name: "Lisa Park",
      title: "Mobile Engineering Lead",
      company: "App Innovations",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 112,
      sessions: 298,
      responseTime: "< 2 hours",
      location: "Austin, TX",
      expertise: ["React Native", "iOS", "Android", "Mobile UX"],
      bio: "Built 20+ mobile apps reaching millions of users. Passionate about mobile development best practices.",
      hourlyRate: 135,
      availability: "Available",
    },
    {
      id: 6,
      name: "Robert Kim",
      title: "Security Engineer",
      company: "SecureNet Inc",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 78,
      sessions: 189,
      responseTime: "< 4 hours",
      location: "Remote",
      expertise: ["Cybersecurity", "Penetration Testing", "Security Audits"],
      bio: "Ethical hacker and security consultant. Helping organizations stay secure for 10+ years.",
      hourlyRate: 160,
      availability: "Limited",
    },
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-500";
      case "Limited":
        return "bg-yellow-500";
      case "Busy":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DocLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Connect with Mentors</h1>
          <p className="text-lg text-muted-foreground">
            Learn from industry experts. Get personalized guidance, career advice, and technical mentorship.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">All Mentors</Badge>
          <Badge variant="outline">Engineering</Badge>
          <Badge variant="outline">Design</Badge>
          <Badge variant="outline">Data Science</Badge>
          <Badge variant="outline">DevOps</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{mentor.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {mentor.title} at {mentor.company}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                        <span className="text-xs text-muted-foreground">({mentor.reviews})</span>
                      </div>
                      <Badge className={`${getAvailabilityColor(mentor.availability)} text-xs`}>
                        {mentor.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{mentor.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mentor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mentor.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mentor.sessions} sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${mentor.hourlyRate}/hr</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="flex-1 gap-2">
                  <Video className="w-4 h-4" />
                  Book Session
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DocLayout>
  );
}