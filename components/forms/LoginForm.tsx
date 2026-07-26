"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/lib/validation";
import type { LoginFormData } from "@/types/auth";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login Success");
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-5 rounded-lg bg-white p-8 shadow"
    >
      <h1 className="text-2xl font-bold text-center">
        Login
      </h1>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter email"
          {...register("email")}
          className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-medium"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter password"
          {...register("password")}
          className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-3 text-white transition hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}