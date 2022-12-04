export interface RechargeUser {
  id: number;
  account: string;
  email: string;
  isAdmin: boolean;
  balance: number;
  walletAddress: string;
  accountFrozen: number;
  inviterId: number;
  inviterCode: number;
  gold: number;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface RechargeRecord {
  id: number;
  type: number;
  transactionHash: string;
  amount: number;
  specialAmount: number;
  status: number;
  failureReasons: string;
  user: RechargeUser;
  createAt: string;
  updatedAt: string;
}
