"use client";

import { BookOpen, Clock, Users, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DocLayout from "@/components/doc-layout";

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Master modern web development with React, Next.js, Node.js, and databases. Build production-ready applications.",
      instructor: "Sarah Johnson",
      duration: "12 weeks",
      students: 1243,
      rating: 4.8,
      reviews: 342,
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
      topics: ["React", "Next.js", "Node.js", "MongoDB"],
      progress: 0,
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of user interface and user experience design. Create beautiful and functional designs.",
      instructor: "Michael Chen",
      duration: "8 weeks",
      students: 892,
      rating: 4.9,
      reviews: 256,
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
      topics: ["Figma", "Design Systems", "Prototyping", "User Research"],
      progress: 35,
    },
    {
      id: 3,
      title: "Data Science with Python",
      description: "Dive into data analysis, visualization, and machine learning using Python, pandas, and scikit-learn.",
      instructor: "Dr. Emily Rodriguez",
      duration: "10 weeks",
      students: 2105,
      rating: 4.7,
      reviews: 498,
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      topics: ["Python", "Pandas", "Matplotlib", "Machine Learning"],
      progress: 0,
    },
    {
      id: 4,
      title: "DevOps Engineering",
      description: "Learn Docker, Kubernetes, CI/CD pipelines, and cloud infrastructure. Become a DevOps expert.",
      instructor: "James Williams",
      duration: "14 weeks",
      students: 756,
      rating: 4.6,
      reviews: 189,
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
      topics: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      progress: 62,
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Build cross-platform mobile apps with React Native. Deploy to iOS and Android app stores.",
      instructor: "Lisa Anderson",
      duration: "10 weeks",
      students: 1456,
      rating: 4.8,
      reviews: 387,
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
      topics: ["React Native", "iOS", "Android", "Firebase"],
      progress: 0,
    },
    {
      id: 6,
      title: "Cybersecurity Basics",
      description: "Understand security fundamentals, ethical hacking, and how to protect systems from threats.",
      instructor: "Robert Taylor",
      duration: "6 weeks",
      students: 623,
      rating: 4.7,
      reviews: 145,
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      topics: ["Network Security", "Encryption", "Penetration Testing"],
      progress: 0,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500";
      case "Intermediate":
        return "bg-yellow-500";
      case "Advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DocLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Available Courses</h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive collection of courses. Learn new skills and advance your career.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">All Courses</Badge>
          <Badge variant="outline">Development</Badge>
          <Badge variant="outline">Design</Badge>
          <Badge variant="outline">Data Science</Badge>
          <Badge variant="outline">DevOps</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-4 left-4 ${getLevelColor(course.level)}`}>
                  {course.level}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating} ({course.reviews})</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {course.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Instructor: {course.instructor}</span>
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                {course.progress > 0 ? (
                  <Button className="flex-1">Continue Learning</Button>
                ) : (
                  <Button className="flex-1">Enroll Now</Button>
                )}
                <Button variant="outline">Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DocLayout>
  );
}