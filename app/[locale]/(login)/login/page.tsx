"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Button } from "@heroui/react";
import Link from "next/link";
import { useLoginMutation } from "@/redux/services/api";
import { setToken } from "@/utils";
import { isFetchBaseQueryError } from "@/redux/store";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Define the validation schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Create a type from the Yup schema
type FormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const { locale } = useParams(); // Use locale hook
  const t = useTranslations('login'); // Add translations hook
  const [login, { isLoading, error }] = useLoginMutation(); // Use login mutation hook

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await login(data).unwrap(); // Unwrap to get the result directly
      // Store token in cookies for 7 days
      await setToken("token", response.access_token, 7);
      // Navigate to the home page upon successful login
      window.location.reload();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gradient-to-b from-deepBlue to-lightBlue text-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('title')}</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div>
            <Input
              {...register("email")}
              id="email"
              type="email"
              label={t('emailLabel')}
              color={errors.email ? "danger" : "default"}
              variant="underlined"
              classNames={{
                label: "text-white",
                input: "text-white",
              }}
              fullWidth
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {t(`validation.${errors.email.message}`)}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Input
              {...register("password")}
              id="password"
              type="password"
              label={t('passwordLabel')}
              color={errors.password ? "danger" : "default"}
              variant="underlined"
              classNames={{
                label: "text-white",
                input: "text-white",
              }}
              fullWidth
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {t(`validation.${errors.password.message}`)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition"
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? t('loadingButton') : t('submitButton')}
            </Button>
          </div>
        </form>

        {/* API Error Message */}
        {error && isFetchBaseQueryError(error) && (
          <div className="mt-4">
            <p className="text-red-500 text-sm">
              {error.data &&
              typeof error.data === "object" &&
              "message" in error.data
                ? (error.data as { message: string }).message
                : t('genericError')}
            </p>
          </div>
        )}

        {/* Link to Create Account */}
        <div className="mt-4 text-center">
          <p className="text-white">
            {t('forgetPasswordText')}{" "}
            <Link
              href={`/${locale}/forget-password`}
              className="text-fuschia_maked hover:underline"
            >
              {t('forgetPasswordLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
