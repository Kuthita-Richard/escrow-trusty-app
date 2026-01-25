import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Users,
  DollarSign,
  AlertTriangle,
  FileCheck,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import {
  dummyUsers,
  dummyTransactions,
  dummyDisputes,
  formatCurrency,
  formatDate,
  getTransactionStatusColor,
  getDisputeStatusColor,
} from "@/lib/dummy-data";

export default function AdminDashboard() {
  const totalUsers = dummyUsers.filter((u) => u.role === "user").length;
  const pendingVerifications = dummyUsers.filter(
    (u) => u.kycStatus === "submitted"
  ).length;
  const activeTransactions = dummyTransactions.filter(
    (t) => !["released", "cancelled"].includes(t.status)
  ).length;
  const openDisputes = dummyDisputes.filter(
    (d) => d.status !== "resolved"
  ).length;
  const totalVolume = dummyTransactions.reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = dummyTransactions.slice(0, 5);
  const recentDisputes = dummyDisputes.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of platform activity and management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {pendingVerifications} pending verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalVolume)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Transactions
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {dummyTransactions.length} total transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openDisputes}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/verifications">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Pending Verifications</p>
                <p className="text-2xl font-bold">{pendingVerifications}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/disputes">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold">Open Disputes</p>
                <p className="text-2xl font-bold">{openDisputes}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/transactions">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="font-semibold">Pending Deposits</p>
                <p className="text-2xl font-bold">
                  {dummyTransactions.filter((t) => t.status === "pending").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/transactions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.buyer.name} → {transaction.seller.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={getTransactionStatusColor(transaction.status)}
                      >
                        {transaction.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Disputes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Disputes</CardTitle>
                <CardDescription>Disputes requiring attention</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/disputes">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentDisputes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active disputes
                </p>
              ) : (
                <div className="space-y-4">
                  {recentDisputes.map((dispute) => (
                    <div key={dispute.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {dispute.transaction.title}
                        </p>
                        <Badge
                          variant="secondary"
                          className={getDisputeStatusColor(dispute.status)}
                        >
                          {dispute.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {dispute.reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Opened {formatDate(dispute.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
