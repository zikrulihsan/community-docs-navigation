"use client";

import { Calendar, MapPin, Users, Clock, Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocLayout from "@/components/doc-layout";

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Web Development Workshop",
      description: "Learn modern web development with Next.js, React, and TypeScript. Perfect for beginners and intermediate developers.",
      date: "March 15, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Tech Hub, Room 301",
      attendees: 45,
      maxAttendees: 50,
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Community Meetup",
      description: "Monthly community gathering to network, share ideas, and collaborate on projects. Open to all members.",
      date: "March 20, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Community Center",
      attendees: 32,
      maxAttendees: 100,
      category: "Meetup",
      image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      title: "AI/ML Hackathon",
      description: "24-hour hackathon focused on building AI and machine learning solutions. Form teams and compete for prizes!",
      date: "March 25, 2024",
      time: "9:00 AM - 9:00 AM (next day)",
      location: "Innovation Lab",
      attendees: 78,
      maxAttendees: 120,
      category: "Hackathon",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Career Development Seminar",
      description: "Expert speakers sharing insights on career growth, resume building, and interview preparation.",
      date: "April 2, 2024",
      time: "1:00 PM - 4:00 PM",
      location: "Virtual Event",
      attendees: 156,
      maxAttendees: 200,
      category: "Seminar",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    },
  ];

  const recordings = [
    {
      id: 101,
      title: "React Server Components Deep Dive",
      description: "Comprehensive guide to React Server Components and their benefits in modern web applications.",
      recordedDate: "February 10, 2024",
      duration: "2h 15m",
      views: 3245,
      category: "Workshop",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      speaker: "Sarah Johnson",
    },
    {
      id: 102,
      title: "Building Scalable APIs with Node.js",
      description: "Learn best practices for building production-ready REST and GraphQL APIs with Node.js and Express.",
      recordedDate: "February 5, 2024",
      duration: "1h 45m",
      views: 2187,
      category: "Workshop",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      speaker: "Michael Chen",
    },
    {
      id: 103,
      title: "UX Design Principles Masterclass",
      description: "Master the fundamental principles of user experience design with real-world examples and case studies.",
      recordedDate: "January 28, 2024",
      duration: "3h 00m",
      views: 5621,
      category: "Seminar",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
      speaker: "Emily Rodriguez",
    },
    {
      id: 104,
      title: "DevOps Best Practices 2024",
      description: "Explore modern DevOps practices including CI/CD pipelines, containerization, and infrastructure as code.",
      recordedDate: "January 20, 2024",
      duration: "2h 30m",
      views: 4312,
      category: "Workshop",
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
      speaker: "James Williams",
    },
    {
      id: 105,
      title: "Machine Learning for Beginners",
      description: "Introduction to machine learning concepts, algorithms, and practical applications using Python.",
      recordedDate: "January 15, 2024",
      duration: "2h 00m",
      views: 7854,
      category: "Workshop",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      speaker: "Dr. Emily Rodriguez",
    },
  ];

  return (
    <DocLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Community Events</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Join our upcoming events or watch recordings from past sessions. Connect with fellow community members and grow together.
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="gap-6 justify-start">
            <TabsTrigger value="upcoming">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="recordings">
              <Video className="w-4 h-4 mr-2" />
              Recordings
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="lg:flex">
                    <div className="lg:w-1/3 h-48 lg:h-auto relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4">{event.category}</Badge>
                    </div>
                    <div className="lg:w-2/3">
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-xl sm:text-2xl">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{event.attendees} / {event.maxAttendees} attendees</span>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2 flex-col sm:flex-row">
                        <Button className="w-full sm:flex-1">Register Now</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Learn More</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings" className="space-y-6">
            <div className="grid gap-4 sm:gap-6">
              {recordings.map((recording) => (
                <Card key={recording.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="lg:flex">
                    <div className="lg:w-1/3 h-48 lg:h-auto relative overflow-hidden group">
                      <img
                        src={recording.thumbnail}
                        alt={recording.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 left-4">{recording.category}</Badge>
                      <Badge className="absolute bottom-4 right-4 bg-black/70">
                        {recording.duration}
                      </Badge>
                    </div>
                    <div className="lg:w-2/3">
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-xl sm:text-2xl">{recording.title}</CardTitle>
                        <CardDescription>{recording.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Recorded on {recording.recordedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>Speaker: {recording.speaker}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="w-4 h-4 text-muted-foreground" />
                          <span>{recording.views.toLocaleString()} views</span>
                        </div>
                      </CardContent>
                      <CardFooter className="gap-2 flex-col sm:flex-row">
                        <Button className="w-full sm:flex-1 gap-2">
                          <Play className="w-4 h-4" />
                          Watch Recording
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">Details</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DocLayout>
  );
}
