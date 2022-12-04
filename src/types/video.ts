import {File} from "./file";

export interface Video {
  id: number;
  file: File;
  createdAt: string;
  updatedAt: string;
}
