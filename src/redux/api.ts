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

export const getRecommendedBooks = async () => {
  const { data } = await instance.get("/books/recommend");
  return data;
};
