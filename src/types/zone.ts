import {File} from "./file";

export interface Zone {
  id: string;
  title: string;
  cover: File;
  probability: number;
  unitPrice: number;
  shareProfit: number;
  takes: number;
  award: number;
  gold: number;
  introduce: string;
  createdAt: string;
  updatedAt: string;
}
