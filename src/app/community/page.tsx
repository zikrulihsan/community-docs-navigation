"use client";

import { Users, MapPin, Hash, TrendingUp, Lock, Globe, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DocLayout from "@/components/doc-layout";

export default function CommunityPage() {
  const communities = [
    {
      id: 1,
      name: "Web Developers Unite",
      description: "A vibrant community for web developers to share knowledge, collaborate on projects, and discuss the latest trends in web development.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
      members: 15420,
      posts: 2847,
      category: "Development",
      type: "Public",
      tags: ["React", "Next.js", "TypeScript", "Web Dev"],
      trending: true,
      moderators: [
        { name: "Sarah J.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
        { name: "Mike C.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 2,
      name: "UI/UX Designers Hub",
      description: "Connect with fellow designers, share your portfolio, get feedback, and stay updated with the latest design trends and tools.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
      members: 8934,
      posts: 1654,
      category: "Design",
      type: "Public",
      tags: ["Figma", "UI Design", "UX Research", "Prototyping"],
      trending: false,
      moderators: [
        { name: "Emily R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 3,
      name: "AI & Machine Learning",
      description: "Explore the world of artificial intelligence and machine learning. Discuss algorithms, share research, and build ML projects together.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      members: 12567,
      posts: 3421,
      category: "Data Science",
      type: "Public",
      tags: ["Python", "TensorFlow", "Deep Learning", "AI"],
      trending: true,
      moderators: [
        { name: "Dr. Emily R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
        { name: "James A.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 4,
      name: "DevOps & Cloud",
      description: "Master DevOps practices, cloud infrastructure, and automation. Share best practices and troubleshoot together.",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
      members: 6789,
      posts: 1234,
      category: "DevOps",
      type: "Public",
      tags: ["AWS", "Kubernetes", "Docker", "CI/CD"],
      trending: false,
      moderators: [
        { name: "James W.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 5,
      name: "Mobile App Developers",
      description: "iOS, Android, and cross-platform development community. Share code, discuss frameworks, and build amazing mobile experiences.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
      members: 9876,
      posts: 2103,
      category: "Development",
      type: "Public",
      tags: ["React Native", "Flutter", "iOS", "Android"],
      trending: true,
      moderators: [
        { name: "Lisa P.", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 6,
      name: "Cybersecurity Experts",
      description: "Discuss security best practices, ethical hacking, and protect the digital world. Share knowledge and stay secure.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      members: 5432,
      posts: 987,
      category: "Security",
      type: "Private",
      tags: ["Security", "Ethical Hacking", "Encryption", "Pentesting"],
      trending: false,
      moderators: [
        { name: "Robert K.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 7,
      name: "Data Visualization",
      description: "Create beautiful and insightful data visualizations. Share charts, dashboards, and learn from data storytellers.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      members: 4567,
      posts: 856,
      category: "Data Science",
      type: "Public",
      tags: ["D3.js", "Tableau", "Data Viz", "Analytics"],
      trending: false,
      moderators: [
        { name: "Anna S.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      ],
    },
    {
      id: 8,
      name: "Startup Founders",
      description: "Connect with fellow entrepreneurs, share startup experiences, get advice, and grow your business together.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop",
      members: 7890,
      posts: 1456,
      category: "Business",
      type: "Public",
      tags: ["Entrepreneurship", "Startups", "Business", "Funding"],
      trending: true,
      moderators: [
        { name: "Alex M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
        { name: "Sofia L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    return type === "Private" ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === "Private" ? "bg-amber-500" : "bg-green-500";
  };

  return (
    <DocLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Communities</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Join communities based on your interests. Connect with like-minded people, share knowledge, and grow together.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">All Communities</Badge>
          <Badge variant="outline">Development</Badge>
          <Badge variant="outline">Design</Badge>
          <Badge variant="outline">Data Science</Badge>
          <Badge variant="outline">Business</Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`${getTypeColor(community.type)}`}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(community.type)}
                      {community.type}
                    </span>
                  </Badge>
                  {community.trending && (
                    <Badge className="bg-orange-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    </Badge>
                  )}
                </div>
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {community.category}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{community.name}</CardTitle>
                <CardDescription className="line-clamp-2">{community.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-1">
                  {community.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Hash className="w-3 h-3 mr-0.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {community.members.toLocaleString()} members
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {community.posts.toLocaleString()} posts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Moderators:</span>
                  <div className="flex -space-x-2">
                    {community.moderators.map((mod, idx) => (
                      <Avatar key={idx} className="w-6 h-6 border-2 border-background">
                        <AvatarImage src={mod.avatar} alt={mod.name} />
                        <AvatarFallback>{mod.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="gap-2 flex-col sm:flex-row">
                <Button className="w-full sm:flex-1 gap-2">
                  <Heart className="w-4 h-4" />
                  Join Community
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-4 sm:p-6 lg:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Can't find your community?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Create your own community and bring people together around your interests.
          </p>
          <Button size="lg" className="gap-2">
            <Users className="w-4 h-4" />
            Create New Community
          </Button>
        </div>
      </div>
    </DocLayout>
  );
}
