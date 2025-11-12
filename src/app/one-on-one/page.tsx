"use client";

import DocLayout from "@/components/doc-layout";
import { User, Calendar, MessageSquare, Target, Star, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function OneOnOnePage() {
  const mentors = [
    {
      name: "Sarah Johnson",
      role: "Senior Frontend Engineer",
      company: "Tech Corp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      expertise: ["React", "TypeScript", "Next.js", "Architecture"],
      rating: 4.9,
      sessions: 127,
      availability: "Available",
    },
    {
      name: "Mike Chen",
      role: "Lead Backend Developer",
      company: "StartupXYZ",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      expertise: ["Node.js", "System Design", "PostgreSQL", "APIs"],
      rating: 4.8,
      sessions: 95,
      availability: "Available",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Designer",
      company: "Design Studio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      expertise: ["UI/UX", "Figma", "User Research", "Prototyping"],
      rating: 5.0,
      sessions: 83,
      availability: "Limited",
    },
    {
      name: "Alex Kumar",
      role: "Engineering Manager",
      company: "Global Tech",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      expertise: ["Leadership", "Career Growth", "Team Building", "Strategy"],
      rating: 4.9,
      sessions: 156,
      availability: "Available",
    },
  ];

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">1-on-1 Mentorship</h1>
          <p className="text-lg text-muted-foreground">
            Get personalized guidance from experienced professionals. Book individual sessions tailored to your specific goals and challenges.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Personal Attention</CardTitle>
              <CardDescription>
                One-on-one sessions focused entirely on your questions, challenges, and goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Book sessions at times that work for you. Choose from hourly or package options.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Customized Plan</CardTitle>
              <CardDescription>
                Work with your mentor to create a personalized learning path aligned with your career.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Available Mentors</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {mentors.map((mentor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={mentor.image} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{mentor.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {mentor.role}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-1">
                            {mentor.company}
                          </p>
                        </div>
                        <Badge
                          className={
                            mentor.availability === "Available"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }
                        >
                          {mentor.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{mentor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{mentor.sessions} sessions</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Book Session</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold">Choose a Mentor</h3>
              <p className="text-sm text-muted-foreground">
                Browse mentors by expertise and select the one that fits your needs.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold">Book a Session</h3>
              <p className="text-sm text-muted-foreground">
                Pick a time that works for you from the mentor's calendar.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold">Have Your Session</h3>
              <p className="text-sm text-muted-foreground">
                Meet via video call and discuss your goals and challenges.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                4
              </div>
              <h3 className="font-semibold">Follow Up</h3>
              <p className="text-sm text-muted-foreground">
                Get action items and schedule follow-up sessions as needed.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Session Options</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Single Session</CardTitle>
                <CardDescription>Perfect for specific questions or advice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">$50</p>
                <p className="text-sm text-muted-foreground mb-4">per 60-minute session</p>
                <Button className="w-full">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Popular</Badge>
                <CardTitle>Package of 5</CardTitle>
                <CardDescription>Best for ongoing mentorship</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">$225</p>
                <p className="text-sm text-muted-foreground mb-4">$45 per session (save 10%)</p>
                <Button className="w-full">Buy Package</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Plan</CardTitle>
                <CardDescription>For dedicated career development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-2">$160</p>
                <p className="text-sm text-muted-foreground mb-4">4 sessions per month (save 20%)</p>
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Browse All Mentors</Button>
          <Button size="lg" variant="outline">Become a Mentor</Button>
        </div>
      </div>
    </DocLayout>
  );
}
