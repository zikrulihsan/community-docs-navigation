"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  href: string;
  description?: string;
}

interface CollapsibleNavProps {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
  defaultOpen?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export default function CollapsibleNav({
  title,
  icon: Icon,
  items,
  defaultOpen = true,
  onNavigate,
  className,
}: CollapsibleNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className={cn("space-y-1", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
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
          {items.map((item) => {
            const ItemIcon = item.icon;
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
                  <ItemIcon className="w-4 h-4" />
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
