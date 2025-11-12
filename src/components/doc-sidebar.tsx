"use client";

import Link from "next/link";
import { BookOpen, Users, MessageSquare, GraduationCap, Sparkles, BaggageClaim, Search } from "lucide-react";
import CollapsibleNav, { NavItem } from "@/components/ui/collapsible-nav";
import { Portal } from "@radix-ui/react-dialog";

interface DocSidebarProps {
  onNavigate?: () => void;
}

export default function DocSidebar({ onNavigate }: DocSidebarProps = {}) {
  // About Us Section
  const aboutUsItems: NavItem[] = [
    {
      title: "Intro",
      icon: BookOpen,
      href: "/",
    },
    {
      title: "Community",
      icon: MessageSquare,
      href: "/community",
    },
    {
      title: "How to Join",
      icon: Users,
      href: "/how-to-join",
    },
  ];

  // Course & Mentorship Section
  const courseMentorshipItems: NavItem[] = [
    {
      title: "Online Class",
      icon: Users,
      href: "/online-class",
    },
    {
      title: "Thematic Mentorship",
      icon: GraduationCap,
      href: "/thematic-mentorship",
    },
    {
      title: "Group Mentoring",
      icon: Users,
      href: "/group-mentoring",
    },
    {
      title: "1o1",
      icon: MessageSquare,
      href: "/one-on-one",
    }
  ];

  // Activity Section
  const activityItems: NavItem[] = [
    {
      title: "Member Talks",
      icon: Users,
      href: "/member-talks",
    },
    {
      title: "English Club",
      icon: MessageSquare,
      href: "/english-club",
    },
    {
      title: "CS Fundamental Session",
      icon: GraduationCap,
      href: "/cs-fundamental",
    },
    {
      title: "Study Group",
      icon: BookOpen,
      href: "/study-group",
    },
    {
      title: "Job Portal",
      icon: Search,
      href: "/job-portal",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            C
          </div>
          <div>
            <h2 className="text-lg font-semibold">Community</h2>
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>

        <div className="space-y-4">
         

          <CollapsibleNav
            title="Member Space"
            icon={Sparkles}
            items={activityItems}
            defaultOpen={true}
            onNavigate={onNavigate}
          />

           <CollapsibleNav
            title="Course & Mentorship"
            icon={GraduationCap}
            items={courseMentorshipItems}
            defaultOpen={true}
            onNavigate={onNavigate}
          />

           <CollapsibleNav
            title="About Us"
            icon={BookOpen}
            items={aboutUsItems}
            defaultOpen={false}
            onNavigate={onNavigate}
          />
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Quick Links</p>
          <div className="space-y-1">
            <Link
              href="#"
              className="block text-xs text-primary hover:underline"
            >
              GitHub
            </Link>
            <Link
              href="#"
              className="block text-xs text-primary hover:underline"
            >
              Discord
            </Link>
            <Link
              href="#"
              className="block text-xs text-primary hover:underline"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
