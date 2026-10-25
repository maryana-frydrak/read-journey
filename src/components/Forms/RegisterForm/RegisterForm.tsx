"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", formData);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#1f1f1f] shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Реєстрація</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-2 text-gray-300">Ім'я</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введіть ваше ім'я"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:border-[#ff6b0a]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">
            Електронна пошта
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:border-[#ff6b0a]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300">Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Створіть пароль"
            required
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-700 text-white focus:outline-none focus:border-[#ff6b0a]"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-3 px-4 bg-[#ff6b0a] hover:bg-[#e05e05] text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Зареєструватися
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Вже маєте акаунт?{" "}
        <Link
          href="/login"
          className="text-[#ff6b0a] hover:underline font-medium"
        >
          Увійти
        </Link>
      </p>
    </div>
  );
}
