"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Button } from "@heroui/react";
import { useParams, useRouter } from "next/navigation"; // Import Next.js router
import { useResetPassordMutation } from "@/redux/services/api"; // Import the login mutation hook
import { isFetchBaseQueryError } from "@/redux/store";
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
  // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  // .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

// Create a type from the Yup schema
type FormData = yup.InferType<typeof schema>;

export default function LoginForm() {
  const t = useTranslations('resetPassword'); // Add translations hook
  const { locale } = useParams();
  const router = useRouter();
  const [resetPassword, { isLoading, error }] = useResetPassordMutation(); // Use login mutation hook

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await resetPassword(data).unwrap(); // Unwrap to get the result directly
      // Assuming the response contains a token that needs to be stored in cookies
      console.log(response);
      router.push(`/${locale}/login`); // Navigate to the home page upon successful login
    } catch (err) {
      console.error("Login failed:", err); // Error will be handled in the UI
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-gradient-to-b mx-auto from-lightBlue to-deepBlue shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className="mb-4">
          <Input
            {...register("email")}
            id="email"
            type="email"
            label={t('emailLabel')}
            placeholder={t('emailPlaceholder')}
            color={errors.email ? "danger" : "default"}
            fullWidth
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {t(`validation.${errors.email.message}`)}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <Input
            {...register("password")}
            id="password"
            type="password"
            label={t('passwordLabel')}
            placeholder={t('passwordPlaceholder')}
            color={errors.password ? "danger" : "default"}
            fullWidth
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {t(`validation.${errors.password.message}`)}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          color="primary"
          fullWidth
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          {isLoading ? t('updatingButton') : t('updateButton')}
        </Button>
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
      {/* <div className="mt-4 text-center">
        <p className="text-gray-600">
          Forget password?{" "}
          <Link
            href="/auth/forget-password"
            className="text-blue-500 hover:underline"
          >
            Reset your password
          </Link>
        </p>
      </div> */}
    </div>
  );
}