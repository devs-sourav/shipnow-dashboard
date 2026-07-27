"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { loginSchema } from "@/lib/validation";
import type { LoginFormData } from "@/types/auth";
import Image from "next/image";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const blockSpace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") e.preventDefault();
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // On mount: prefill email if it was remembered earlier
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = (data: LoginFormData) => {
    setIsSubmitting(true);

    // Simulate a login request / session creation
    setTimeout(() => {
      // Fake session - frontend only, no real auth
      localStorage.setItem(
        "session",
        JSON.stringify({ email: data.email, loggedIn: true })
      );

      // Remember Me: only store the email, never the password
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      setIsSubmitting(false);
      router.push("/dashboard");
    }, 600); // simulate network delay, optional
  };

  return (
    <div className="w-[326px] sm:w-full max-w-[410px]  md:mt-0">
      {/* Logo */}

      <div className="mb-8 flex justify-center items-center">
        <div className="relative h-10 w-10 ">
          <Image
            src="/assets/logo/Logo2.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Heading */}

      <div className="text-center">
        <h1 className="text-[24px] font-bold text-[#333333] leading-[32px]">Welcome Back</h1>

        <p className="mt-3 font-normal text-[14px] text-[#757575]">
          Log in to continue managing your logistics with ShipNow
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-14 space-y-4">
        {/* Email */}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[15px] font-semibold text-[#333333]"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter a valid email address"
            {...register("email")}
            onKeyDown={blockSpace}
            className={`h-[58px] placeholder:text-[#757575] w-full rounded-xl border bg-[#F5F5F5] px-5 text-[15px] outline-none transition
            ${
              errors.email
                ? "border-red-500"
                : "border-[#ECECEC] focus:border-[#856DF3]"
            }`}
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[15px] font-semibold text-[#222]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password")}
              onKeyDown={blockSpace}
              className={`h-[58px] w-full rounded-xl border bg-[#F8F8F8] px-5 pr-14 text-[15px] outline-none transition
              ${
                errors.password
                  ? "border-red-500"
                  : "border-[#ECECEC] focus:border-[#856DF3]"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember */}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#666]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-[#856DF3]"
            />
            Remember Me
          </label>

          <Link
            href="/forgot-password"
            className="text-[14px] font-medium text-[#856DF3] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 h-[60px] cursor-pointer w-full rounded-xl bg-[#2C2C2C] text-[18px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* Register */}

        <p className="pt-2 text-center text-[15px] text-[#777]">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#856DF3]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}