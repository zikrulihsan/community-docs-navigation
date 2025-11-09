"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, BookOpen, Calendar, Users, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DocSidebarProps {
  onNavigate?: () => void;
}

export default function DocSidebar({ onNavigate }: DocSidebarProps = {}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    {
      title: "Events",
      icon: Calendar,
      href: "/events",
      description: "Community events and meetups",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/courses",
      description: "Learning resources and tutorials",
    },
    // {
    //   title: "Mentor",
    //   icon: Users,
    //   href: "/mentor",
    //   description: "Connect with mentors",
    // },
    {
      title: "Community",
      icon: MessageSquare,
      href: "/community",
      description: "Join communities",
    },
  ];

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

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

        <nav className="space-y-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Docs
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isOpen && "transform rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div className="ml-2 space-y-1 border-l-2 border-border pl-2">
              <Link
                href="/"
                onClick={handleLinkClick}
                className={cn(
                  "block px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === "/"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                Introduction
              </Link>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "block px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.title}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

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
