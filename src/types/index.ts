export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  imageUrl: string;
  recommend?: boolean;
  totalPages?: number;
  pages?: number;
  status?: "unread" | "in-progress" | "done";
}

export interface ReadingSession {
  _id?: string;
  id?: string;
  startPage?: number;
  finishPage?: number;
  startReading?: string;
  finishReading?: string;
  status?: string;
}

export interface BookWithProgress extends Book {
  progress?: ReadingSession[];
  status?: "unread" | "in-progress" | "done";
}
