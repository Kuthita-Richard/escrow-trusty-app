import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from "lucide-react";
import {
  currentUser,
  getTransactionsByUser,
  formatCurrency,
  formatDate,
  getTransactionStatusColor,
  type Transaction,
} from "@/lib/dummy-data";

export default function TransactionList() {
  const user = currentUser;
  const allTransactions = getTransactionsByUser(user.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filterTransactions = (transactions: Transaction[]) => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === "buying") {
      filtered = filtered.filter((t) => t.buyerId === user.id);
    } else if (activeTab === "selling") {
      filtered = filtered.filter((t) => t.sellerId === user.id);
    } else if (activeTab === "active") {
      filtered = filtered.filter((t) =>
        ["pending", "funded", "in_progress", "delivered"].includes(t.status)
      );
    } else if (activeTab === "completed") {
      filtered = filtered.filter((t) => t.status === "released");
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions(allTransactions);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Manage all your escrow transactions</p>
          </div>
          <Button asChild>
            <Link to="/transactions/new">
              <Plus className="mr-2 h-4 w-4" /> New Transaction
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="buying">Buying</TabsTrigger>
                  <TabsTrigger value="selling">Selling</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 && "s"}
            </CardTitle>
            <CardDescription>
              {activeTab === "all"
                ? "All your transactions"
                : activeTab === "buying"
                ? "Transactions where you are the buyer"
                : activeTab === "selling"
                ? "Transactions where you are the seller"
                : activeTab === "active"
                ? "Currently active transactions"
                : "Completed transactions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No transactions found</p>
                <Button asChild>
                  <Link to="/transactions/new">Create Your First Transaction</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => {
                  const isBuyer = transaction.buyerId === user.id;
                  return (
                    <Link
                      key={transaction.id}
                      to={`/transactions/${transaction.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            isBuyer ? "bg-destructive/10" : "bg-success/10"
                          }`}
                        >
                          {isBuyer ? (
                            <ArrowUpRight className="h-6 w-6 text-destructive" />
                          ) : (
                            <ArrowDownLeft className="h-6 w-6 text-success" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{transaction.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {isBuyer
                              ? `Paying to ${transaction.seller.name}`
                              : `Receiving from ${transaction.buyer.name}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant="secondary"
                          className={getTransactionStatusColor(transaction.status)}
                        >
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
