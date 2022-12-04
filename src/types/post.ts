export interface Tag {
  id: number;
  name: string;
  posts: Post[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  tags: Tag[];
  posts: Post[];
  createdAt: string;
  updatedAt: string;
}

export interface PreviewPictureFile {
  id: number;
  url: string;
  size: number;
  md5FileName: string;
  name: string;
  post: Post;
  createdAt: string;
  updatedAt: string;
}

export interface CoverPictureFile {
  id: number;
  url: string;
  size: number;
  md5FileName: string;
  name: string;
  post: Post;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadFile {
  id: number;
  url: string;
  size: number;
  md5FileName: string;
  name: string;
  post: Post;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  cover: string;
  title: string;
  downloadUrl: string;
  praise: number;
  collectNum: number;
  viewNum: number;
  downloadNum: number;
  previewUrls: string;
  tags: Tag[];
  coverPictureFiles: CoverPictureFile[];
  previewPictureFiles: PreviewPictureFile[];
  downloadFiles: DownloadFile[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}


export interface PreviewPictureFile {
  id: number;
  url: string;
  size: number;
  md5FileName: string;
  name: string;
  posts: Post[];
  createdAt: string;
  updatedAt: string;
}
export interface CoverPictureFile {
  id: number;
  url: string;
  size: number;
  md5FileName: string;
  name: string;
  posts: Post[];
  createdAt: string;
  updatedAt: string;
}
