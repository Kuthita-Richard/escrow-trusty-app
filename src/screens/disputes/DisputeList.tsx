"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertTriangle, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import {
  formatDate,
  formatCurrency,
  getDisputeStatusColor,
  type Dispute,
} from "@/lib/dummy-data";
import { useAuth } from "@/lib/auth-context";
import { getDisputesByUser } from "@/lib/firestore/disputes";

export function DisputeList() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) return;
      setLoading(true);
      const list = await getDisputesByUser(user.id);
      if (!cancelled) setDisputes(list);
      if (!cancelled) setLoading(false);
    }
    run().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "under_review":
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Disputes</h1>
          <p className="text-muted-foreground">Manage and track dispute resolutions</p>
        </div>

        {/* Disputes List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {disputes.length} Dispute{disputes.length !== 1 && "s"}
            </CardTitle>
            <CardDescription>All disputes related to your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading disputes...</div>
            ) : disputes.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Disputes</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have any disputes. Keep up the great communication!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <Link
                    key={dispute.id}
                    href={`/disputes/${dispute.id}`}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          {getStatusIcon(dispute.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{dispute.transaction.title}</h3>
                            <Badge variant="secondary" className={getDisputeStatusColor(dispute.status)}>
                              {dispute.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dispute.reason}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Opened {formatDate(dispute.createdAt)}</span>
                            <span>•</span>
                            <span>
                              {dispute.openedBy === user.id
                                ? "Opened by you"
                                : `Opened by ${dispute.openedByUser.name}`}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {dispute.messages.length} messages
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold">{formatCurrency(dispute.transaction.amount)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DisputeList;

