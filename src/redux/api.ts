import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
export const nextServer = axios.create({
  baseURL: `${baseURL}`,
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
    nextServer.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete nextServer.defaults.headers.common["Authorization"];
  }
};

export const clearAuthToken = () => {
  delete nextServer.defaults.headers.common.Authorization;
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
  const { data } = await nextServer.post("/users/signup", userData);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const signinUser = async (userData: {
  email: string;
  password: string;
}) => {
  const { data } = await nextServer.post("/users/signin", userData);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await nextServer.get("/users/current");
  return data;
};

export const refreshCurrentUser = async () => {
  const { data } = await nextServer.get("/users/current/refresh");
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const signoutUser = async () => {
  const { data } = await nextServer.post("/users/signout");
  clearAuthToken();
  return data;
};

nextServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await nextServer.get("/users/current/refresh");
        if (data.token) {
          setAuthToken(data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return nextServer(originalRequest);
        }
      } catch (refreshError) {
        clearAuthToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const getRecommendedBooks = async () => {
  const { data } = await nextServer.get("/books/recommend");
  return data;
};

export const addBook = async (bookData: {
  title: string;
  author: string;
  year: number;
  pages: number;
}) => {
  const { data } = await nextServer.post("/books/add", bookData);
  return data;
};

export const addBookFromRecommend = async (id: string) => {
  const { data } = await nextServer.post(`/books/add/${id}`);
  return data;
};

export const removeUserBook = async (id: string) => {
  const { data } = await nextServer.delete(`/books/remove/${id}`);
  return data;
};

export const getOwnBooks = async () => {
  const { data } = await nextServer.get("/books/own");
  return data;
};

export const startReading = async (readingData: {
  id: string;
  page: number;
}) => {
  const { data } = await nextServer.post("/books/reading/start", readingData);
  return data;
};

export const finishReading = async (readingData: {
  id: string;
  page: number;
}) => {
  const { data } = await nextServer.post("/books/reading/finish", readingData);
  return data;
};

export const deleteReading = async (id: string) => {
  const { data } = await nextServer.delete("/books/reading", { data: { id } });
  return data;
};

export const getBookById = async (id: string) => {
  const { data } = await nextServer.get(`/books/${id}`);
  return data;
};
