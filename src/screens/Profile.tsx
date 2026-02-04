"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Mail, Phone, Shield, Upload, CheckCircle2, Clock, AlertTriangle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile } from "@/lib/firestore/users";

export function Profile() {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      await updateUserProfile(user.id, { name, phone: phone || undefined });
      await refreshProfile();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      toast({ title: "Update failed", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const kycBadge = useMemo(() => {
    if (!user) return null;
    switch (user.kycStatus) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Clock className="h-3 w-3 mr-1" /> Under Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" /> Not Verified
          </Badge>
        );
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and verification</p>
        </div>

        {/* Profile Picture & Basic Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name ?? "User"}</h2>
                <p className="text-muted-foreground">{user?.email ?? ""}</p>
                <div className="flex items-center gap-2 mt-2">{kycBadge}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="pl-9"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* KYC Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Identity Verification
            </CardTitle>
            <CardDescription>Verify your identity to unlock all platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verification Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                {user.kycStatus === "approved" ? (
                  <CheckCircle2 className="h-8 w-8 text-success" />
                ) : user.kycStatus === "submitted" ? (
                  <Clock className="h-8 w-8 text-warning" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">
                    {user.kycStatus === "approved"
                      ? "Identity Verified"
                      : user.kycStatus === "submitted"
                        ? "Verification In Progress"
                        : "Verification Required"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.kycStatus === "approved"
                      ? "Your identity has been verified"
                      : user.kycStatus === "submitted"
                        ? "We're reviewing your documents"
                        : "Upload your ID to get verified"}
                  </p>
                </div>
              </div>
              {kycBadge}
            </div>

            {user?.kycStatus === "pending" && (
              <>
                <Separator />

                {/* Upload Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Upload ID Document</h4>
                  <p className="text-sm text-muted-foreground">
                    Please upload a clear photo of your government-issued ID (passport, driver&apos;s license, or national
                    ID)
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">Front of ID</p>
                      <p className="text-xs text-muted-foreground mb-3">JPG, PNG up to 5MB</p>
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">Back of ID</p>
                      <p className="text-xs text-muted-foreground mb-3">JPG, PNG up to 5MB</p>
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full">Submit for Verification</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Profile;

