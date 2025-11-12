"use client";

import DocLayout from "@/components/doc-layout";
import { Target, Code, Database, Palette, TrendingUp, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ThematicMentorshipPage() {
  const themes = [
    {
      title: "Web Development",
      icon: Code,
      description: "Master modern web technologies, frameworks, and best practices with guidance from senior developers.",
      topics: ["React", "Next.js", "TypeScript", "API Design"],
      mentors: 12,
    },
    {
      title: "Data Science & ML",
      icon: Database,
      description: "Learn data analysis, machine learning algorithms, and AI implementation from data science experts.",
      topics: ["Python", "TensorFlow", "Data Analysis", "ML Models"],
      mentors: 8,
    },
    {
      title: "UI/UX Design",
      icon: Palette,
      description: "Develop your design skills with mentorship in user experience, interface design, and prototyping.",
      topics: ["Figma", "User Research", "Prototyping", "Design Systems"],
      mentors: 6,
    },
    {
      title: "DevOps & Cloud",
      icon: Globe,
      description: "Build expertise in cloud infrastructure, CI/CD pipelines, and modern DevOps practices.",
      topics: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      mentors: 10,
    },
    {
      title: "Product Management",
      icon: Target,
      description: "Learn product strategy, roadmap planning, and stakeholder management from experienced PMs.",
      topics: ["Strategy", "Roadmapping", "Analytics", "Leadership"],
      mentors: 5,
    },
    {
      title: "Career Growth",
      icon: TrendingUp,
      description: "Get guidance on career transitions, interview preparation, and professional development.",
      topics: ["Resume", "Interviews", "Networking", "Negotiation"],
      mentors: 15,
    },
  ];

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Thematic Mentorship</h1>
          <p className="text-lg text-muted-foreground">
            Focus your learning with specialized mentorship programs designed around specific themes and career paths. Work with mentors who are experts in your area of interest.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold">Choose Your Theme</h3>
              <p className="text-sm text-muted-foreground">
                Select a thematic area that aligns with your learning goals and career aspirations.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold">Match with Mentors</h3>
              <p className="text-sm text-muted-foreground">
                Get paired with experienced mentors who specialize in your chosen theme.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold">Learn & Grow</h3>
              <p className="text-sm text-muted-foreground">
                Participate in structured sessions and projects focused on your theme.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Available Themes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme, index) => {
              const Icon = theme.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{theme.title}</CardTitle>
                    <CardDescription>{theme.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Key Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {theme.topics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {theme.mentors} mentors available
                        </span>
                        <Button size="sm">Apply</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Program Benefits</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Focused learning path tailored to your theme</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Access to multiple mentors within the theme</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Structured curriculum and learning materials</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Regular group sessions and workshops</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Portfolio-building projects</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Theme-specific certification</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Apply for Mentorship</Button>
          <Button size="lg" variant="outline">Become a Mentor</Button>
        </div>
      </div>
    </DocLayout>
  );
}
