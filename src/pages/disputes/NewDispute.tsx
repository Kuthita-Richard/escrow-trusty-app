import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, AlertTriangle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { currentUser, getTransactionsByUser, formatCurrency } from "@/lib/dummy-data";

export default function NewDispute() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const preselectedTransaction = searchParams.get("transaction");

  const user = currentUser;
  const transactions = getTransactionsByUser(user.id).filter(
    (t) => !["released", "cancelled", "disputed"].includes(t.status)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(preselectedTransaction || "");
  const [reason, setReason] = useState("");
  const [statement, setStatement] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTransaction || !reason.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a transaction and provide a reason.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: "Dispute opened",
        description: "Your dispute has been submitted. Our team will review it shortly.",
      });
      setIsLoading(false);
      navigate("/disputes");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/disputes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Open a Dispute</h1>
            <p className="text-muted-foreground">
              Report an issue with a transaction
            </p>
          </div>
        </div>

        {/* Warning */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-start gap-4 py-4">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Before opening a dispute</p>
              <p className="text-sm text-muted-foreground">
                We recommend trying to resolve the issue directly with the other party first. 
                Opening a dispute will put the transaction on hold until it's resolved.
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Transaction</CardTitle>
              <CardDescription>
                Choose the transaction you want to dispute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedTransaction}
                onValueChange={setSelectedTransaction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a transaction" />
                </SelectTrigger>
                <SelectContent>
                  {transactions.length === 0 ? (
                    <SelectItem value="" disabled>
                      No eligible transactions
                    </SelectItem>
                  ) : (
                    transactions.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title} - {formatCurrency(t.amount)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Dispute Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Details</CardTitle>
              <CardDescription>
                Provide details about the issue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Dispute *</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe the issue..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statement">Your Statement (optional)</Label>
                <Textarea
                  id="statement"
                  placeholder="Provide a detailed statement of your side of the story..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Evidence Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence (optional)</CardTitle>
              <CardDescription>
                Upload any supporting documents or files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported: PDF, Images, Documents (Max 10MB each)
                </p>
                <Button type="button" variant="outline">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/disputes")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Open Dispute"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
