"use client";

import DocLayout from "@/components/doc-layout";
import { Briefcase, MapPin, DollarSign, Clock, Building2, TrendingUp, Users, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function JobPortalPage() {
  const jobListings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: {
        name: "TechCorp Inc",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
        size: "500-1000 employees",
      },
      location: "Remote (US)",
      type: "Full-time",
      salary: "$120k - $160k",
      experience: "5+ years",
      postedDate: "2 days ago",
      description: "We're looking for an experienced Frontend Developer to join our growing team and help build modern web applications.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"],
      applicants: 23,
      featured: true,
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: {
        name: "StartupXYZ",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
        size: "50-100 employees",
      },
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$130k - $170k",
      experience: "3+ years",
      postedDate: "3 days ago",
      description: "Join our backend team to build scalable microservices and APIs that power our platform.",
      skills: ["Node.js", "PostgreSQL", "Docker", "Kubernetes"],
      benefits: ["Equity", "Health Insurance", "Gym Membership", "Learning Budget"],
      applicants: 18,
      featured: true,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: {
        name: "Digital Solutions",
        logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop",
        size: "100-500 employees",
      },
      location: "Remote (Global)",
      type: "Full-time",
      salary: "$100k - $140k",
      experience: "3-5 years",
      postedDate: "5 days ago",
      description: "We need a versatile Full Stack Developer who can work across our entire technology stack.",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      benefits: ["Remote Work", "Health Insurance", "Paid Time Off", "Conference Budget"],
      applicants: 31,
      featured: false,
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: {
        name: "CloudScale",
        logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop",
        size: "1000+ employees",
      },
      location: "New York, NY",
      type: "Full-time",
      salary: "$140k - $180k",
      experience: "4+ years",
      postedDate: "1 week ago",
      description: "Help us build and maintain cloud infrastructure for our enterprise customers.",
      skills: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
      benefits: ["Stock Options", "Health Insurance", "Relocation Assistance", "401k"],
      applicants: 15,
      featured: false,
    },
    {
      id: 5,
      title: "UI/UX Designer",
      company: {
        name: "Design Studio Co",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
        size: "10-50 employees",
      },
      location: "Remote (Europe)",
      type: "Full-time",
      salary: "$80k - $110k",
      experience: "2+ years",
      postedDate: "1 week ago",
      description: "Create beautiful and intuitive user experiences for our digital products.",
      skills: ["Figma", "UI Design", "User Research", "Prototyping"],
      benefits: ["Remote Work", "Flexible Hours", "Professional Development", "Health Insurance"],
      applicants: 27,
      featured: false,
    },
    {
      id: 6,
      title: "Mobile Developer (React Native)",
      company: {
        name: "AppMakers Inc",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
        size: "50-100 employees",
      },
      location: "Austin, TX",
      type: "Full-time",
      salary: "$110k - $150k",
      experience: "3+ years",
      postedDate: "2 weeks ago",
      description: "Build cross-platform mobile applications using React Native for iOS and Android.",
      skills: ["React Native", "TypeScript", "iOS", "Android"],
      benefits: ["Health Insurance", "Stock Options", "Paid Time Off", "Work from Home"],
      applicants: 12,
      featured: false,
    },
  ];

  const jobStats = [
    { label: "Active Jobs", value: "150+", icon: Briefcase },
    { label: "Companies", value: "75+", icon: Building2 },
    { label: "Placements", value: "200+", icon: Users },
    { label: "Avg. Salary", value: "$125k", icon: DollarSign },
  ];

  const popularCategories = [
    { name: "Frontend Development", count: 42 },
    { name: "Backend Development", count: 38 },
    { name: "Full Stack", count: 35 },
    { name: "DevOps", count: 24 },
    { name: "UI/UX Design", count: 18 },
    { name: "Data Science", count: 16 },
    { name: "Mobile Development", count: 15 },
    { name: "Product Management", count: 12 },
  ];

  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Job Portal</h1>
          <p className="text-lg text-muted-foreground">
            Discover opportunities from companies that value our community. All job listings are vetted and member-recommended.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Exclusive for Community Members: Priority access to job postings and direct connections with hiring managers!</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Find Your Next Opportunity</CardTitle>
            <CardDescription>Search and filter jobs based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by title, company, or skills..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularCategories.map((category, index) => (
              <button
                key={index}
                className="p-4 border border-border rounded-lg hover:bg-accent hover:border-primary transition-colors text-left"
              >
                <p className="font-semibold">{category.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{category.count} jobs</p>
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest Job Postings</h2>
            <Button variant="outline">Post a Job</Button>
          </div>
          <div className="space-y-4">
            {jobListings.map((job) => (
              <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.featured ? 'border-primary' : ''}`}>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <Avatar className="w-16 h-16 rounded-lg">
                          <AvatarImage src={job.company.logo} alt={job.company.name} />
                          <AvatarFallback>{job.company.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                              <p className="font-medium text-sm">{job.company.name}</p>
                              <p className="text-xs text-muted-foreground">{job.company.size}</p>
                            </div>
                            {job.featured && (
                              <Badge className="bg-yellow-500">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <CardDescription className="mb-3">
                        {job.description}
                      </CardDescription>

                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{job.postedDate}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Benefits:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.benefits.map((benefit, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64 space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Experience Required</p>
                        <p className="font-semibold">{job.experience}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Applicants</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applicants} applied
                        </p>
                      </div>
                      <Button className="w-full">Apply Now</Button>
                      <Button variant="outline" className="w-full">Save Job</Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="outline" size="lg">Load More Jobs</Button>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Career Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Resume Review</CardTitle>
                <CardDescription>
                  Get your resume reviewed by experienced professionals in the community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Request Review</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Interview Prep</CardTitle>
                <CardDescription>
                  Practice interviews with mentors and get feedback on your performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Book Session</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Referrals</CardTitle>
                <CardDescription>
                  Connect with community members who can refer you to their companies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Browse Network</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* For Employers */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">For Employers</h2>
              <p className="text-muted-foreground mb-4">
                Post your job openings and connect with talented developers from our community. Get access to pre-vetted candidates who are actively learning and growing.
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Access to skilled and motivated candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Featured job listings for better visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Direct communication with applicants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Company profile and branding opportunities</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <Button size="lg">Post a Job</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg">Browse All Jobs</Button>
          <Button size="lg" variant="outline">Set Job Alerts</Button>
        </div>
      </div>
    </DocLayout>
  );
}
