"use client";

import { Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocLayout from "@/components/doc-layout";

export default function MentorPage() {
  return (
    <DocLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Users className="w-20 h-20 text-muted-foreground" />
                <Sparkles className="w-8 h-8 text-primary absolute -top-2 -right-2" />
              </div>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold">Mentor Connections</CardTitle>
            <CardDescription className="text-lg mt-2">
              Coming Soon
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We're building an amazing mentorship platform to connect you with industry experts.
              Get personalized guidance, career advice, and technical mentorship from experienced professionals.
            </p>
            <p className="text-sm text-muted-foreground">
              Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}