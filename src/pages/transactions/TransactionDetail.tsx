import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  currentUser,
  dummyTransactions,
  formatCurrency,
  formatDate,
  formatDateTime,
  getTransactionStatusColor,
} from "@/lib/dummy-data";

export default function TransactionDetail() {
  const { id } = useParams();
  const user = currentUser;
  const transaction = dummyTransactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
          <Button asChild>
            <Link to="/transactions">Back to Transactions</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isBuyer = transaction.buyerId === user.id;
  const otherParty = isBuyer ? transaction.seller : transaction.buyer;
  const completedMilestones = transaction.milestones.filter(
    (m) => m.status === "completed" || m.status === "released"
  ).length;
  const progress = (completedMilestones / transaction.milestones.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "released":
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "disputed":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/transactions">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{transaction.title}</h1>
              <Badge
                variant="secondary"
                className={getTransactionStatusColor(transaction.status)}
              >
                {transaction.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">{transaction.description}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="text-lg">
                    {completedMilestones}/{transaction.milestones.length} Milestones
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3 mb-6" />
                <div className="space-y-4">
                  {transaction.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(milestone.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(milestone.status)}
                        <span className="text-sm capitalize">
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Available actions for this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {transaction.status === "pending" && isBuyer && (
                  <Button>Fund Transaction</Button>
                )}
                {transaction.status === "funded" && !isBuyer && (
                  <Button>Start Work</Button>
                )}
                {transaction.status === "in_progress" && !isBuyer && (
                  <Button>Mark as Delivered</Button>
                )}
                {transaction.status === "delivered" && isBuyer && (
                  <>
                    <Button>Approve & Release</Button>
                    <Button variant="outline">Request Revision</Button>
                  </>
                )}
                {!["released", "cancelled", "disputed"].includes(transaction.status) && (
                  <Button variant="destructive" asChild>
                    <Link to={`/disputes/new?transaction=${transaction.id}`}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Open Dispute
                    </Link>
                  </Button>
                )}
                {transaction.status === "disputed" && (
                  <Button variant="outline" asChild>
                    <Link to={`/disputes`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View Dispute
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <div className="w-0.5 flex-1 bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium">Transaction Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  {transaction.fundedAt && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <div className="w-0.5 flex-1 bg-border" />
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">Funds Deposited</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(transaction.fundedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  {transaction.releasedAt && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-success" />
                      </div>
                      <div>
                        <p className="font-medium">Funds Released</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(transaction.releasedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Amount Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transaction Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {transaction.currency}
                </p>
              </CardContent>
            </Card>

            {/* Parties Card */}
            <Card>
              <CardHeader>
                <CardTitle>Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {isBuyer ? "You (Buyer)" : "Buyer"}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.buyer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.buyer.email}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {!isBuyer ? "You (Seller)" : "Seller"}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.seller.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.seller.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-sm">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(transaction.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(transaction.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
