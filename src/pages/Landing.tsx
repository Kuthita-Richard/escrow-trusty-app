import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  Lock,
  Users,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Your funds are held safely until both parties fulfill their obligations.",
  },
  {
    icon: Lock,
    title: "Verified Users",
    description: "Multi-layer verification including email, phone, and KYC ensures trust.",
  },
  {
    icon: AlertTriangle,
    title: "Dispute Resolution",
    description: "Fair and transparent dispute handling with evidence-based decisions.",
  },
  {
    icon: FileCheck,
    title: "Milestone Payments",
    description: "Break down large projects into milestones for safer, staged payments.",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Transaction",
    description: "Client creates an escrow transaction with project details and milestones.",
    icon: DollarSign,
  },
  {
    step: 2,
    title: "Fund Escrow",
    description: "Client deposits funds via bank transfer. Admin confirms receipt.",
    icon: Lock,
  },
  {
    step: 3,
    title: "Work & Deliver",
    description: "Freelancer completes the work and marks milestones as delivered.",
    icon: Clock,
  },
  {
    step: 4,
    title: "Release Payment",
    description: "Client approves delivery, admin releases funds to freelancer.",
    icon: CheckCircle2,
  },
];

const stats = [
  { value: "$2.5M+", label: "Transactions Protected" },
  { value: "5,000+", label: "Happy Users" },
  { value: "99.8%", label: "Successful Transactions" },
  { value: "24/7", label: "Support Available" },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Trusted by 5,000+ Freelancers & Clients
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Secure Payments for{" "}
              <span className="text-primary">Freelance Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Protect your transactions with our escrow service. We hold funds safely until the work is done, ensuring trust between clients and freelancers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SecureEscrow?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive protection for both buyers and sellers in every transaction.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process that protects everyone involved.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.step < 4 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <Users className="h-12 w-12 mx-auto opacity-80" />
                <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Join thousands of freelancers and clients who trust SecureEscrow for their transactions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/signup">Create Free Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link to="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
