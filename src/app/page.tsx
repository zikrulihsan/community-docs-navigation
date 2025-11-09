"use client";

import DocLayout from "@/components/doc-layout";
import { BookOpen, Zap, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <DocLayout>
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Welcome to Community Hub</h1>
          <p className="text-xl text-muted-foreground">
            Your one-stop platform for learning, networking, and growing together. Join events, 
            enroll in courses, and connect with experienced mentors.
          </p>
          <div className="flex gap-3 pt-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Explore Resources</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Learn</CardTitle>
              <CardDescription>
                Access a wide range of courses designed to help you master new skills and advance your career.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Connect</CardTitle>
              <CardDescription>
                Network with peers, join community events, and build meaningful professional relationships.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Grow</CardTitle>
              <CardDescription>
                Get personalized mentorship from industry experts to accelerate your professional growth.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Browse Events</h3>
                <p className="text-muted-foreground">
                  Check out our upcoming community events, workshops, and hackathons. Register for events that interest you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enroll in Courses</h3>
                <p className="text-muted-foreground">
                  Explore our comprehensive course catalog covering development, design, data science, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Find a Mentor</h3>
                <p className="text-muted-foreground">
                  Connect with experienced professionals who can guide you in your career journey and skill development.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/events" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <h3 className="font-semibold mb-1">Browse Events →</h3>
              <p className="text-sm text-muted-foreground">Discover upcoming community events and workshops</p>
            </a>
            <a href="/courses" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <h3 className="font-semibold mb-1">View Courses →</h3>
              <p className="text-sm text-muted-foreground">Explore our collection of learning resources</p>
            </a>
            <a href="/mentor" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <h3 className="font-semibold mb-1">Connect with Mentors →</h3>
              <p className="text-sm text-muted-foreground">Get guidance from experienced professionals</p>
            </a>
            <a href="#" className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <h3 className="font-semibold mb-1">Join Community →</h3>
              <p className="text-sm text-muted-foreground">Become part of our growing community</p>
            </a>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}