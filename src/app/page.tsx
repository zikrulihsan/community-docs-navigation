"use client";

import DocLayout from "@/components/doc-layout";
import { BookOpen, Zap, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <DocLayout>
      <div className="space-y-8 sm:space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Welcome to Community Hub</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            Your one-stop platform for learning, networking, and growing together. Join events,
            enroll in courses, and connect with experienced mentors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Resources</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

        <div className="bg-muted rounded-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Getting Started</h2>
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

        <div className="border-t pt-6 sm:pt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Links</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Link href="/events" className="p-4 border rounded-lg hover:bg-accent transition-colors" prefetch={true}>
              <h3 className="font-semibold mb-1">Browse Events →</h3>
              <p className="text-sm text-muted-foreground">Discover upcoming community events and workshops</p>
            </Link>
            <Link href="/courses" className="p-4 border rounded-lg hover:bg-accent transition-colors" prefetch={true}>
              <h3 className="font-semibold mb-1">View Courses →</h3>
              <p className="text-sm text-muted-foreground">Explore our collection of learning resources</p>
            </Link>
            <Link href="/mentor" className="p-4 border rounded-lg hover:bg-accent transition-colors" prefetch={true}>
              <h3 className="font-semibold mb-1">Connect with Mentors →</h3>
              <p className="text-sm text-muted-foreground">Get guidance from experienced professionals</p>
            </Link>
            <Link href="/community" className="p-4 border rounded-lg hover:bg-accent transition-colors" prefetch={true}>
              <h3 className="font-semibold mb-1">Join Community →</h3>
              <p className="text-sm text-muted-foreground">Become part of our growing community</p>
            </Link>
          </div>
        </div>
      </div>
    </DocLayout>
  );
}