import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Eye,
  DollarSign,
  ArrowRight,
  User,
} from "lucide-react";
import {
  dummyDisputes,
  formatCurrency,
  formatDate,
  getDisputeStatusColor,
} from "@/lib/dummy-data";
import { useToast } from "@/hooks/use-toast";

export default function AdminDisputes() {
  const { toast } = useToast();

  const handleResolve = (disputeId: string, resolution: string) => {
    toast({
      title: "Dispute resolved",
      description: `Dispute has been resolved: ${resolution.replace("_", " ")}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dispute Management</h1>
          <p className="text-muted-foreground">
            Review and resolve transaction disputes
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold">
                    {dummyDisputes.filter((d) => d.status === "open").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">
                    {dummyDisputes.filter((d) => d.status === "under_review").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">
                    {dummyDisputes.filter((d) => d.status === "resolved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disputes List */}
        <Card>
          <CardHeader>
            <CardTitle>All Disputes</CardTitle>
            <CardDescription>
              Click on a dispute to review details and evidence
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dummyDisputes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No disputes</h3>
                <p className="text-muted-foreground">
                  All transactions are running smoothly
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dummyDisputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="p-4 rounded-lg border space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {dispute.transaction.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getDisputeStatusColor(dispute.status)}
                          >
                            {dispute.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {dispute.reason}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Opened {formatDate(dispute.createdAt)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(dispute.transaction.amount)}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/disputes/${dispute.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Link>
                      </Button>
                    </div>

                    {/* Parties */}
                    <div className="flex items-center gap-8 p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Buyer</p>
                          <p className="text-sm font-medium">
                            {dispute.transaction.buyer.name}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Seller</p>
                          <p className="text-sm font-medium">
                            {dispute.transaction.seller.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Resolution Actions */}
                    {dispute.status !== "resolved" && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <p className="text-sm text-muted-foreground mr-2">
                          Resolve:
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(dispute.id, "refund_buyer")}
                        >
                          Refund Buyer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(dispute.id, "release_seller")}
                        >
                          Release to Seller
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(dispute.id, "split")}
                        >
                          Split 50/50
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
