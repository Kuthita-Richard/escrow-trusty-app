import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import {
  dummyTransactions,
  formatCurrency,
  formatDate,
  getTransactionStatusColor,
  type Transaction,
} from "@/lib/dummy-data";
import { useToast } from "@/hooks/use-toast";

export default function AdminTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const filterTransactions = (transactions: Transaction[]) => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((t) => t.status === activeTab);
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions(dummyTransactions);

  const handleConfirmDeposit = (transactionId: string) => {
    toast({
      title: "Deposit confirmed",
      description: `Transaction ${transactionId} has been marked as funded.`,
    });
  };

  const handleReleaseFunds = (transactionId: string) => {
    toast({
      title: "Funds released",
      description: `Funds for transaction ${transactionId} have been released to the seller.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">All Transactions</h1>
          <p className="text-muted-foreground">
            Manage and monitor all platform transactions
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, user, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="funded">Funded</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  <TabsTrigger value="disputed">Disputed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredTransactions.length} Transaction
              {filteredTransactions.length !== 1 && "s"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Transaction
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Buyer</th>
                    <th className="text-left py-3 px-4 font-medium">Seller</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{transaction.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {transaction.id}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{transaction.buyer.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{transaction.seller.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={getTransactionStatusColor(transaction.status)}
                        >
                          {transaction.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/transactions/${transaction.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {transaction.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleConfirmDeposit(transaction.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                          {transaction.status === "delivered" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReleaseFunds(transaction.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
