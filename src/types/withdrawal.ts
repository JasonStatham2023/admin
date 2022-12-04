export interface WithdrawalUser {
  id: number;
  account: string;
  email: string;
  isAdmin: boolean;
  balance: number;
  walletAddress:string;
  accountFrozen: number;
  withdrawalAmount: number;
  inviterId: number;
  inviterCode: number;
  gold: number;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRecord {
  id: number;
  type: number;
  transactionHash: string;
  amount: number;
  specialAmount: number;
  status: number;
  failureReasons: string;
  user: WithdrawalUser;
  createAt: string;
  updatedAt: string;
  account:string;
}
