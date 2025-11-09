"use client";

import DocSidebar from "./doc-sidebar";
import { Search, Menu } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DocLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <DocSidebar />
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <DocSidebar onNavigate={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Logo for mobile */}
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                C
              </div>
              <span className="font-semibold">Community</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 flex items-center gap-2 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <Input
                type="search"
                placeholder="Search..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 hidden sm:block"
              />
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 md:flex">
                ⌘K
              </kbd>
            </div>

   

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
