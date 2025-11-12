"use client";

import DocLayout from "@/components/doc-layout";
import { Video, Clock, Calendar, Users, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OnlineClassPage() {
  const upcomingClasses = [
    {
      title: "React Advanced Patterns",
      instructor: "Sarah Johnson",
      date: "Nov 15, 2025",
      time: "7:00 PM - 9:00 PM",
      duration: "2 hours",
      level: "Advanced",
      enrolled: 45,
      maxStudents: 50,
    },
    {
      title: "TypeScript Fundamentals",
      instructor: "Mike Chen",
      date: "Nov 18, 2025",
      time: "6:00 PM - 8:00 PM",
      duration: "2 hours",
      level: "Beginner",
      enrolled: 38,
      maxStudents: 60,
    },
    {
      title: "System Design Principles",
      instructor: "Alex Rodriguez",
      date: "Nov 20, 2025",
      time: "8:00 PM - 10:00 PM",
      duration: "2 hours",
      level: "Intermediate",
      enrolled: 52,
      maxStudents: 40,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
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
          <h1 className="text-4xl font-bold tracking-tight">Online Classes</h1>
          <p className="text-lg text-muted-foreground">
            Join live, interactive online classes taught by industry experts. Learn at your own pace with recorded sessions available for all enrolled students.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Live Interactive Sessions</CardTitle>
              <CardDescription>
                Attend live classes with real-time Q&A and interaction with instructors and peers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Access Recordings</CardTitle>
              <CardDescription>
                All sessions are recorded and available for review anytime after the class.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Earn Certificates</CardTitle>
              <CardDescription>
                Complete classes and receive certificates to showcase your learning achievements.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{classItem.title}</CardTitle>
                        <Badge className={getLevelColor(classItem.level)}>
                          {classItem.level}
                        </Badge>
                      </div>
                      <CardDescription>
                        Instructor: {classItem.instructor}
                      </CardDescription>
                    </div>
                    <Button>Enroll Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{classItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{classItem.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{classItem.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {classItem.enrolled}/{classItem.maxStudents} enrolled
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Class Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Live instruction from experienced professionals</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Interactive Q&A sessions</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Practical hands-on projects</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Access to class materials and resources</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Peer collaboration opportunities</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Certificate of completion</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Browse All Classes</Button>
          <Button size="lg" variant="outline">View Schedule</Button>
        </div>
      </div>
    </DocLayout>
  );
}
