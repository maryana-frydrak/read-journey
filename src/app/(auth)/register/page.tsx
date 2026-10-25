import RegisterForm from "@/components/Forms/RegisterForm/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12">
      <div className="w-full lg:w-1/2 flex justify-center">
        <RegisterForm />
      </div>

      {/* Права колонка: Промо-блок / Інформація про проєкт */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
          Read Journey
        </h1>
        <p className="text-lg text-gray-400 max-w-md">
          Розширюйте свій світогляд, читаючи книги. Почніть свою літературну
          подорож разом із нами вже сьогодні.
        </p>
      </div>
    </main>
  );
}
