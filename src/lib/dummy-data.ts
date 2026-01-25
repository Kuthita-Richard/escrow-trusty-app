// Dummy data for the escrow platform

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'submitted' | 'approved' | 'rejected';
  role: 'user' | 'admin';
  createdAt: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'funded' | 'in_progress' | 'delivered' | 'released' | 'disputed' | 'cancelled';
  buyerId: string;
  sellerId: string;
  buyer: User;
  seller: User;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  fundedAt?: string;
  releasedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'funded' | 'completed' | 'released';
  dueDate?: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  transaction: Transaction;
  openedBy: string;
  openedByUser: User;
  status: 'open' | 'under_review' | 'resolved';
  reason: string;
  resolution?: 'refund_buyer' | 'release_seller' | 'split';
  resolutionNote?: string;
  evidence: Evidence[];
  messages: DisputeMessage[];
  createdAt: string;
  resolvedAt?: string;
}

export interface Evidence {
  id: string;
  type: 'file' | 'link' | 'statement';
  content: string;
  fileName?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DisputeMessage {
  id: string;
  senderId: string;
  sender: User;
  content: string;
  createdAt: string;
}

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@email.com',
    name: 'John Doe',
    phone: '+1 555-123-4567',
    isVerified: true,
    kycStatus: 'approved',
    role: 'user',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-2',
    email: 'jane.smith@email.com',
    name: 'Jane Smith',
    phone: '+1 555-987-6543',
    isVerified: true,
    kycStatus: 'approved',
    role: 'user',
    createdAt: '2024-02-20T14:45:00Z',
  },
  {
    id: 'user-3',
    email: 'mike.wilson@email.com',
    name: 'Mike Wilson',
    isVerified: false,
    kycStatus: 'pending',
    role: 'user',
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@escrow.com',
    name: 'Admin User',
    phone: '+1 555-000-0000',
    isVerified: true,
    kycStatus: 'approved',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const currentUser = dummyUsers[0];

// Dummy Transactions
export const dummyTransactions: Transaction[] = [
  {
    id: 'txn-1',
    title: 'Website Development Project',
    description: 'Full-stack e-commerce website with payment integration',
    amount: 5000,
    currency: 'USD',
    status: 'in_progress',
    buyerId: 'user-1',
    sellerId: 'user-2',
    buyer: dummyUsers[0],
    seller: dummyUsers[1],
    milestones: [
      { id: 'm1', title: 'Design Phase', amount: 1500, status: 'completed' },
      { id: 'm2', title: 'Frontend Development', amount: 2000, status: 'funded' },
      { id: 'm3', title: 'Backend & Testing', amount: 1500, status: 'pending' },
    ],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    fundedAt: '2024-03-02T09:00:00Z',
  },
  {
    id: 'txn-2',
    title: 'Logo Design',
    description: 'Professional logo design with 3 concepts and revisions',
    amount: 500,
    currency: 'USD',
    status: 'funded',
    buyerId: 'user-1',
    sellerId: 'user-3',
    buyer: dummyUsers[0],
    seller: dummyUsers[2],
    milestones: [
      { id: 'm1', title: 'Initial Concepts', amount: 250, status: 'funded' },
      { id: 'm2', title: 'Final Delivery', amount: 250, status: 'pending' },
    ],
    createdAt: '2024-03-20T16:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z',
    fundedAt: '2024-03-21T10:00:00Z',
  },
  {
    id: 'txn-3',
    title: 'Mobile App UI/UX Design',
    description: 'Complete UI/UX design for iOS and Android app',
    amount: 3000,
    currency: 'USD',
    status: 'released',
    buyerId: 'user-2',
    sellerId: 'user-1',
    buyer: dummyUsers[1],
    seller: dummyUsers[0],
    milestones: [
      { id: 'm1', title: 'Wireframes', amount: 1000, status: 'released' },
      { id: 'm2', title: 'High-fidelity Designs', amount: 2000, status: 'released' },
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-28T14:30:00Z',
    fundedAt: '2024-02-02T09:00:00Z',
    releasedAt: '2024-02-28T14:30:00Z',
  },
  {
    id: 'txn-4',
    title: 'Content Writing Package',
    description: '10 blog posts with SEO optimization',
    amount: 800,
    currency: 'USD',
    status: 'disputed',
    buyerId: 'user-1',
    sellerId: 'user-2',
    buyer: dummyUsers[0],
    seller: dummyUsers[1],
    milestones: [
      { id: 'm1', title: 'First 5 Articles', amount: 400, status: 'completed' },
      { id: 'm2', title: 'Remaining 5 Articles', amount: 400, status: 'pending' },
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-25T14:30:00Z',
    fundedAt: '2024-03-11T09:00:00Z',
  },
  {
    id: 'txn-5',
    title: 'Video Editing Services',
    description: 'Edit and produce 5 promotional videos',
    amount: 1500,
    currency: 'USD',
    status: 'pending',
    buyerId: 'user-1',
    sellerId: 'user-3',
    buyer: dummyUsers[0],
    seller: dummyUsers[2],
    milestones: [
      { id: 'm1', title: 'Video Editing', amount: 1000, status: 'pending' },
      { id: 'm2', title: 'Final Export', amount: 500, status: 'pending' },
    ],
    createdAt: '2024-03-28T10:00:00Z',
    updatedAt: '2024-03-28T10:00:00Z',
  },
];

// Dummy Disputes
export const dummyDisputes: Dispute[] = [
  {
    id: 'dispute-1',
    transactionId: 'txn-4',
    transaction: dummyTransactions[3],
    openedBy: 'user-1',
    openedByUser: dummyUsers[0],
    status: 'under_review',
    reason: 'Content quality does not meet the agreed specifications',
    evidence: [
      {
        id: 'ev-1',
        type: 'file',
        content: '/documents/contract.pdf',
        fileName: 'contract.pdf',
        uploadedBy: 'user-1',
        uploadedAt: '2024-03-25T15:00:00Z',
      },
      {
        id: 'ev-2',
        type: 'statement',
        content: 'The delivered articles contain numerous grammatical errors and do not follow the SEO guidelines we agreed upon.',
        uploadedBy: 'user-1',
        uploadedAt: '2024-03-25T15:05:00Z',
      },
      {
        id: 'ev-3',
        type: 'link',
        content: 'https://docs.google.com/document/d/example',
        uploadedBy: 'user-2',
        uploadedAt: '2024-03-25T16:00:00Z',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        sender: dummyUsers[0],
        content: 'I have attached the original contract showing the quality requirements.',
        createdAt: '2024-03-25T15:10:00Z',
      },
      {
        id: 'msg-2',
        senderId: 'user-2',
        sender: dummyUsers[1],
        content: 'I followed all the guidelines. The link I provided shows my work process.',
        createdAt: '2024-03-25T16:05:00Z',
      },
    ],
    createdAt: '2024-03-25T14:30:00Z',
  },
];

// Helper functions
export const getTransactionsByUser = (userId: string) => {
  return dummyTransactions.filter(
    (t) => t.buyerId === userId || t.sellerId === userId
  );
};

export const getDisputesByUser = (userId: string) => {
  return dummyDisputes.filter(
    (d) => d.transaction.buyerId === userId || d.transaction.sellerId === userId
  );
};

export const getTransactionStatusColor = (status: Transaction['status']) => {
  const colors = {
    pending: 'bg-muted text-muted-foreground',
    funded: 'bg-primary/10 text-primary',
    in_progress: 'bg-warning/10 text-warning',
    delivered: 'bg-success/10 text-success',
    released: 'bg-success text-success-foreground',
    disputed: 'bg-destructive/10 text-destructive',
    cancelled: 'bg-muted text-muted-foreground',
  };
  return colors[status];
};

export const getDisputeStatusColor = (status: Dispute['status']) => {
  const colors = {
    open: 'bg-destructive/10 text-destructive',
    under_review: 'bg-warning/10 text-warning',
    resolved: 'bg-success/10 text-success',
  };
  return colors[status];
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
