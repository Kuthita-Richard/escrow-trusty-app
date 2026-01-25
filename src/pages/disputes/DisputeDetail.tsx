import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  currentUser,
  dummyDisputes,
  formatCurrency,
  formatDateTime,
  getDisputeStatusColor,
} from "@/lib/dummy-data";
import { useToast } from "@/hooks/use-toast";

export default function DisputeDetail() {
  const { id } = useParams();
  const user = currentUser;
  const dispute = dummyDisputes.find((d) => d.id === id);
  const { toast } = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [newStatement, setNewStatement] = useState("");
  const [newLink, setNewLink] = useState("");

  if (!dispute) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Dispute Not Found</h1>
          <Button asChild>
            <Link to="/disputes">Back to Disputes</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    toast({
      title: "Message sent",
      description: "Your message has been added to the dispute thread.",
    });
    setNewMessage("");
  };

  const handleAddStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;
    toast({
      title: "Statement added",
      description: "Your written statement has been submitted as evidence.",
    });
    setNewStatement("");
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.trim()) return;
    toast({
      title: "Link added",
      description: "The external link has been added as evidence.",
    });
    setNewLink("");
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
            <Link to="/disputes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{dispute.transaction.title}</h1>
              <Badge
                variant="secondary"
                className={getDisputeStatusColor(dispute.status)}
              >
                {dispute.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Dispute opened on {formatDateTime(dispute.createdAt)}
            </p>
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
                      <p className="text-center text-muted-foreground py-8">
                        No messages yet. Start the conversation.
                      </p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {dispute.messages.map((message) => {
                          const isCurrentUser = message.senderId === user.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${
                                isCurrentUser ? "flex-row-reverse" : ""
                              }`}
                            >
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div
                                className={`flex-1 max-w-[80%] ${
                                  isCurrentUser ? "text-right" : ""
                                }`}
                              >
                                <div
                                  className={`inline-block p-3 rounded-lg ${
                                    isCurrentUser
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
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
                        <div
                          key={ev.id}
                          className="flex items-start gap-3 p-3 rounded-lg border"
                        >
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
                              {ev.type === "file"
                                ? ev.fileName
                                : ev.type === "link"
                                ? "External Link"
                                : "Written Statement"}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {ev.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Uploaded {formatDateTime(ev.uploadedAt)}
                            </p>
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
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Upload Files
                        </Button>
                      </div>

                      {/* Add Link */}
                      <form onSubmit={handleAddLink} className="space-y-2">
                        <label className="text-sm font-medium">External Link</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://..."
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                          />
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
                  <span className="font-medium capitalize">
                    {dispute.status.replace("_", " ")}
                  </span>
                </div>
                {dispute.resolution && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Resolution</p>
                      <p className="font-medium capitalize">
                        {dispute.resolution.replace("_", " ")}
                      </p>
                      {dispute.resolutionNote && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {dispute.resolutionNote}
                        </p>
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
                  <span className="font-bold">
                    {formatCurrency(dispute.transaction.amount)}
                  </span>
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
                  <Link to={`/transactions/${dispute.transactionId}`}>
                    View Transaction
                  </Link>
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
