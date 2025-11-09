"use client";

import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DocLayout from "@/components/doc-layout";

export default function EventsPage() {
  const events = [
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

  return (
    <DocLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Community Events</h1>
          <p className="text-lg text-muted-foreground">
            Join our upcoming events, workshops, and meetups. Connect with fellow community members and grow together.
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">All Events</Badge>
          <Badge variant="outline">Workshops</Badge>
          <Badge variant="outline">Meetups</Badge>
          <Badge variant="outline">Hackathons</Badge>
        </div>

        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4">{event.category}</Badge>
                </div>
                <div className="md:w-2/3">
                  <CardHeader>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
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
                  <CardFooter className="gap-2">
                    <Button className="flex-1">Register Now</Button>
                    <Button variant="outline">Learn More</Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DocLayout>
  );
}