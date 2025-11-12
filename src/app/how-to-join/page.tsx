"use client";

import DocLayout from "@/components/doc-layout";
import { CheckCircle, UserPlus, Mail, MessageSquare, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HowToJoinPage() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">How to Join</h1>
          <p className="text-lg text-muted-foreground">
            Become a part of our community in just a few simple steps. We're excited to have you!
          </p>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Join in 4 Easy Steps</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Your Account
                </h3>
                <p className="text-muted-foreground">
                  Sign up with your email address or use your existing social media accounts. Fill out your profile with your interests and expertise.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Verify Your Email
                </h3>
                <p className="text-muted-foreground">
                  Check your inbox for a verification email. Click the link to confirm your account and unlock all community features.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Join Our Channels
                </h3>
                <p className="text-muted-foreground">
                  Connect with us on Discord, Slack, or your preferred communication platform. Introduce yourself and start networking!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Start Learning & Contributing
                </h3>
                <p className="text-muted-foreground">
                  Browse events, enroll in courses, find a mentor, or contribute your knowledge to help others grow.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Free Membership</CardTitle>
              <CardDescription>
                Basic access to community resources, events, and discussion forums. Perfect for getting started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Join Free</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Premium Membership</CardTitle>
              <CardDescription>
                Full access to all courses, 1-on-1 mentorship, exclusive events, and priority support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Learn More</Button>
            </CardContent>
          </Card>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Is there a fee to join?</h3>
              <p className="text-muted-foreground">
                No, joining our community is completely free. We also offer a premium membership with additional benefits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What if I'm a beginner?</h3>
              <p className="text-muted-foreground">
                Everyone is welcome! We have resources and mentors specifically for beginners to help you get started on your journey.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I contribute as a mentor?</h3>
              <p className="text-muted-foreground">
                Absolutely! We're always looking for experienced professionals willing to share their knowledge and guide others.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Get Started Now</Button>
          <Button size="lg" variant="outline">Contact Us</Button>
        </div>
      </div>
    </DocLayout>
  );
}
