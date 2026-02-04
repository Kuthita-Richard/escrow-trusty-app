"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Send,
  Upload,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  getDisputeStatusColor,
  type Dispute,
} from "@/lib/dummy-data";
import { useToast } from "@/hooks/use-toast";
import { addDisputeEvidence, addDisputeMessage, getDispute } from "@/lib/firestore/disputes";
import { useAuth } from "@/lib/auth-context";
import { uploadDisputeEvidenceFile } from "@/lib/storage/evidence";

export function DisputeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [newStatement, setNewStatement] = useState("");
  const [newLink, setNewLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Now persists messages and evidence to Firestore/Storage.

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!id) return;
      setLoading(true);
      const d = await getDispute(String(id));
      if (!cancelled) setDispute(d);
      if (!cancelled) setLoading(false);
    }
    run().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-muted-foreground">Loading dispute...</div>
      </DashboardLayout>
    );
  }

  if (!dispute) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Dispute Not Found</h1>
          <Button asChild>
            <Link href="/disputes">Back to Disputes</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!user || !dispute) return;
    addDisputeMessage({ disputeId: dispute.id, senderId: user.id, content: newMessage.trim() })
      .then(async () => {
        const refreshed = await getDispute(dispute.id);
        setDispute(refreshed);
        toast({ title: "Message sent", description: "Your message has been added to the dispute thread." });
        setNewMessage("");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to send message.";
        toast({ title: "Send failed", description: msg, variant: "destructive" });
      });
  };

  const handleAddStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;
    if (!user || !dispute) return;
    addDisputeEvidence({
      disputeId: dispute.id,
      evidence: {
        id: `ev-${Date.now()}`,
        type: "statement",
        content: newStatement.trim(),
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
      },
    })
      .then(async () => {
        const refreshed = await getDispute(dispute.id);
        setDispute(refreshed);
        toast({ title: "Statement added", description: "Your written statement has been submitted as evidence." });
        setNewStatement("");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to add statement.";
        toast({ title: "Submit failed", description: msg, variant: "destructive" });
      });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.trim()) return;
    if (!user || !dispute) return;
    addDisputeEvidence({
      disputeId: dispute.id,
      evidence: {
        id: `ev-${Date.now()}`,
        type: "link",
        content: newLink.trim(),
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
      },
    })
      .then(async () => {
        const refreshed = await getDispute(dispute.id);
        setDispute(refreshed);
        toast({ title: "Link added", description: "The external link has been added as evidence." });
        setNewLink("");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to add link.";
        toast({ title: "Submit failed", description: msg, variant: "destructive" });
      });
  };

  const handleUploadFile = async (file: File) => {
    if (!user || !dispute) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadDisputeEvidenceFile({ disputeId: dispute.id, file });
      await addDisputeEvidence({
        disputeId: dispute.id,
        evidence: {
          id: `ev-${Date.now()}`,
          type: "file",
          content: uploaded.url,
          fileName: uploaded.fileName,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString(),
        },
      });
      const refreshed = await getDispute(dispute.id);
      setDispute(refreshed);
      toast({ title: "File uploaded", description: "Your file has been added as evidence." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/disputes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{dispute.transaction.title}</h1>
              <Badge variant="secondary" className={getDisputeStatusColor(dispute.status)}>
                {dispute.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">Dispute opened on {formatDateTime(dispute.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reason Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Dispute Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{dispute.reason}</p>
              </CardContent>
            </Card>

            {/* Evidence & Messages Tabs */}
            <Card>
              <Tabs defaultValue="messages">
                <CardHeader>
                  <TabsList>
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Messages ({dispute.messages.length})
                    </TabsTrigger>
                    <TabsTrigger value="evidence" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Evidence ({dispute.evidence.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="messages">
                  <CardContent className="space-y-4">
                    {dispute.messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No messages yet. Start the conversation.</p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {dispute.messages.map((message) => {
                          const isCurrentUser = message.senderId === user.id;
                          return (
                            <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className={`flex-1 max-w-[80%] ${isCurrentUser ? "text-right" : ""}`}>
                                <div
                                  className={`inline-block p-3 rounded-lg ${
                                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {message.sender.name} • {formatDateTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Separator />
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>

                <TabsContent value="evidence">
                  <CardContent className="space-y-6">
                    {/* Evidence List */}
                    <div className="space-y-3">
                      {dispute.evidence.map((ev) => (
                        <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            {ev.type === "file" ? (
                              <FileText className="h-4 w-4" />
                            ) : ev.type === "link" ? (
                              <LinkIcon className="h-4 w-4" />
                            ) : (
                              <MessageSquare className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium capitalize">
                              {ev.type === "file" ? ev.fileName : ev.type === "link" ? "External Link" : "Written Statement"}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ev.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">Uploaded {formatDateTime(ev.uploadedAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Add Evidence */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Add Evidence</h4>

                      {/* File Upload */}
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="outline" size="sm" asChild disabled={isUploading}>
                            <label>
                              {isUploading ? "Uploading..." : "Upload File"}
                              <input
                                className="hidden"
                                type="file"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) void handleUploadFile(f);
                                  // allow re-uploading same file
                                  e.currentTarget.value = "";
                                }}
                              />
                            </label>
                          </Button>
                        </div>
                      </div>

                      {/* Add Link */}
                      <form onSubmit={handleAddLink} className="space-y-2">
                        <label className="text-sm font-medium">External Link</label>
                        <div className="flex gap-2">
                          <Input placeholder="https://..." value={newLink} onChange={(e) => setNewLink(e.target.value)} />
                          <Button type="submit" variant="outline">
                            Add
                          </Button>
                        </div>
                      </form>

                      {/* Written Statement */}
                      <form onSubmit={handleAddStatement} className="space-y-2">
                        <label className="text-sm font-medium">Written Statement</label>
                        <Textarea
                          placeholder="Provide your written statement..."
                          value={newStatement}
                          onChange={(e) => setNewStatement(e.target.value)}
                          rows={3}
                        />
                        <Button type="submit" variant="outline">
                          Submit Statement
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Dispute Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(dispute.status)}
                  <span className="font-medium capitalize">{dispute.status.replace("_", " ")}</span>
                </div>
                {dispute.resolution && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Resolution</p>
                      <p className="font-medium capitalize">{dispute.resolution.replace("_", " ")}</p>
                      {dispute.resolutionNote && (
                        <p className="text-sm text-muted-foreground mt-2">{dispute.resolutionNote}</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Transaction Card */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">{formatCurrency(dispute.transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer</span>
                  <span>{dispute.transaction.buyer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seller</span>
                  <span>{dispute.transaction.seller.name}</span>
                </div>
                <Separator />
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/transactions/${dispute.transactionId}`}>View Transaction</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Participants Card */}
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dispute.transaction.buyer.name}</p>
                    <p className="text-sm text-muted-foreground">Buyer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dispute.transaction.seller.name}</p>
                    <p className="text-sm text-muted-foreground">Seller</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DisputeDetail;

