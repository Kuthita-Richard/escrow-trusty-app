import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  currentUser,
  getTransactionsByUser,
  getDisputesByUser,
  formatCurrency,
  formatDate,
  getTransactionStatusColor,
} from "@/lib/dummy-data";

export default function Dashboard() {
  const user = currentUser;
  const transactions = getTransactionsByUser(user.id);
  const disputes = getDisputesByUser(user.id);

  const activeTransactions = transactions.filter(
    (t) => !["released", "cancelled"].includes(t.status)
  );
  const totalInEscrow = activeTransactions
    .filter((t) => ["funded", "in_progress", "delivered"].includes(t.status))
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingDisputes = disputes.filter((d) => d.status !== "resolved").length;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's an overview of your escrow activity</p>
          </div>
          <Button asChild>
            <Link to="/transactions/new">
              <Plus className="mr-2 h-4 w-4" /> New Transaction
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total in Escrow</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInEscrow)}</div>
              <p className="text-xs text-muted-foreground">
                Across {activeTransactions.length} active transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTransactions.length}</div>
              <p className="text-xs text-muted-foreground">In progress or pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.filter((t) => t.status === "released").length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully released</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDisputes}</div>
              <p className="text-xs text-muted-foreground">Awaiting resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Verification Status */}
        {!user.isVerified && (
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Complete Your Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Verify your identity to unlock all features
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile">Complete Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest escrow activity</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/transactions/new">Create Your First Transaction</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const isBuyer = transaction.buyerId === user.id;
                  return (
                    <Link
                      key={transaction.id}
                      to={`/transactions/${transaction.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            isBuyer ? "bg-destructive/10" : "bg-success/10"
                          }`}
                        >
                          {isBuyer ? (
                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5 text-success" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {isBuyer ? `To: ${transaction.seller.name}` : `From: ${transaction.buyer.name}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {isBuyer ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant="secondary" className={getTransactionStatusColor(transaction.status)}>
                          {transaction.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
