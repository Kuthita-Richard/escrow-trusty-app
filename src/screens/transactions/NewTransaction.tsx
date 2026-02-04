"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { createTransaction } from "@/lib/firestore/transactions";
import { findUserByEmail } from "@/lib/firestore/users";

interface Milestone {
  id: string;
  title: string;
  amount: string;
  description: string;
}

export function NewTransaction() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sellerEmail: "",
    currency: "USD",
  });

  const [milestones, setMilestones] = useState<Milestone[]>([{ id: "1", title: "", amount: "", description: "" }]);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), title: "", amount: "", description: "" }]);
  };

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id));
    }
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate milestones
    const validMilestones = milestones.every((m) => m.title && parseFloat(m.amount) > 0);

    if (!validMilestones) {
      toast({
        title: "Invalid milestones",
        description: "Please fill in all milestone details.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const seller = await findUserByEmail(formData.sellerEmail.trim());
    if (!seller) {
      toast({
        title: "Seller not found",
        description: "That email doesn’t belong to a registered user yet. Ask them to sign up first.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const id = await createTransaction({
        title: formData.title,
        description: formData.description,
        amount: totalAmount,
        currency: formData.currency,
        buyerId: user.id,
        sellerId: seller.id,
        milestones: milestones.map((m) => ({
          title: m.title,
          amount: parseFloat(m.amount),
          description: m.description,
        })),
      });
      toast({
        title: "Transaction created!",
        description: "The seller has been notified. Awaiting your deposit.",
      });
      router.push(`/transactions/${id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create transaction.";
      toast({
        title: "Create failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/transactions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Transaction</h1>
            <p className="text-muted-foreground">Set up an escrow transaction with a freelancer</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Enter the basic information about this transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Transaction Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Development Project"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work to be done..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sellerEmail">Seller&apos;s Email</Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    placeholder="freelancer@example.com"
                    value={formData.sellerEmail}
                    onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <CardDescription>Break down the project into payment milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Milestone {index + 1}</h4>
                    {milestones.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(milestone.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="e.g., Design Phase"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount ({formData.currency})</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(milestone.id, "amount", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      placeholder="Describe this milestone..."
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" className="w-full" onClick={addMilestone}>
                <Plus className="mr-2 h-4 w-4" /> Add Milestone
              </Button>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: formData.currency }).format(totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/transactions")}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Transaction"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default NewTransaction;

