import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setAuthToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const clearAuthToken = () => {
  delete instance.defaults.headers.common.Authorization;
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

if (typeof window !== "undefined") {
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    setAuthToken(savedToken);
  }
}

export const signupUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await instance.post("/users/signup", userData);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const signinUser = async (userData: {
  email: string;
  password: string;
}) => {
  const { data } = await instance.post("/users/signin", userData);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await instance.get("/users/current");
  return data;
};

export const refreshCurrentUser = async () => {
  const { data } = await instance.get("/users/current/refresh");
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const signoutUser = async () => {
  const { data } = await instance.post("/users/signout");
  clearAuthToken();
  return data;
};

export const getRecommendedBooks = async () => {
  const { data } = await instance.get("/books/recommend");
  return data;
};

export const addBook = async (bookData: {
  title: string;
  author: string;
  year: number;
  pages: number;
}) => {
  const { data } = await instance.post("/books/add", bookData);
  return data;
};

export const addBookFromRecommend = async (id: string) => {
  const { data } = await instance.post(`/books/add/${id}`);
  return data;
};

export const removeUserBook = async (id: string) => {
  const { data } = await instance.delete(`/books/remove/${id}`);
  return data;
};

export const getOwnBooks = async () => {
  const { data } = await instance.get("/books/own");
  return data;
};

export const startReading = async (readingData: {
  id: string;
  page: number;
}) => {
  const { data } = await instance.post("/books/reading/start", readingData);
  return data;
};

export const finishReading = async (readingData: {
  id: string;
  page: number;
}) => {
  const { data } = await instance.post("/books/reading/finish", readingData);
  return data;
};

export const deleteReading = async (id: string) => {
  const { data } = await instance.delete("/books/reading", { data: { id } });
  return data;
};

export const getBookById = async (id: string) => {
  const { data } = await instance.get(`/books/${id}`);
  return data;
};
