import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ChangePasswordSchema } from "../../Schema/ChangePasswordSchema";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
export default function ChangePassword() {
  const navigate = useNavigate();

  //  ^ bulid form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      conFirmPassword: "",
    },
    mode: "onBlur",
    resolver: zodResolver(ChangePasswordSchema),
  });

  // ^ API function
  const changePasswordApi = (formData) => {
    // const token = localStorage.getItem("token");
    // console.log("Token:", token);
    return axios.patch(
      "https://route-posts.routemisr.com/users/change-password",
      // ^ body
      {
        password: formData.password,
        newPassword: formData.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  };

  // Mutation
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: changePasswordApi,

    onSuccess: (response) => {
      console.log("Change Password Response:", response);

      const newToken = response.data.data.token;

      // Save the new token
      if (newToken) {
        localStorage.setItem("token", newToken);
      }
      toast.success("Password changed successfully!");
      // Go to home page
      navigate("/home");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });

  // Submit
  const onSubmit = (formData) => {
    mutate(formData);
  };

  return (
    <>
      <Helmet>
        <title>ChangePassword</title>
      </Helmet>
      <div className="bg-sky-300 min-h-screen p-3">
        <div className="w-1/2 bg-white rounded-md mx-auto p-5 shadow mt-10">
          <h2 className="text-sky-600 font-bold text-center text-2xl">
            Change Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-7 mt-5">
              {/* Current Password */}
              <div>
                <Input
                  {...register("password")}
                  type="password"
                  aria-label="Password"
                  className="w-full"
                  placeholder="Enter your Password"
                />

                {errors.password && (
                  <p className="bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <Input
                  {...register("newPassword")}
                  type="password"
                  aria-label="New Password"
                  className="w-full"
                  placeholder="Enter your new Password"
                />

                {errors.newPassword && (
                  <p className="bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Input
                  {...register("conFirmPassword")}
                  type="password"
                  aria-label="conFirmPassword"
                  className="w-full"
                  placeholder="conFirmPassword"
                />

                {errors.conFirmPassword && (
                  <p className="bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md mt-1">
                    {errors.conFirmPassword.message}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {isError && (
                <div className="bg-red-500 text-white font-bold text-center rounded-md py-2">
                  {error?.response?.data?.message || "Something went wrong"}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                isDisabled={isPending}
                className="w-full my-3 font-bold"
              >
                {isPending ? "Loading..." : "ChangePassword"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
