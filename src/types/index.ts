export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  imageUrl: string;
  recommend?: boolean;
  totalPages?: number;
  pages?: number;
}
