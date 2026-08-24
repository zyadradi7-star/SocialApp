import React, { useContext, useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import { Label, ListBox, Select } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Registerschema } from "./../../Schema/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";

export default function Register() {
  //& controlled => control it by react  => useState
  //& uncontrolled => control it by dom  => Ref

  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { userToken, setUserToken } = useContext(AuthContext);
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "onBlur",
    resolver: zodResolver(Registerschema),
  });

  function submitForm(userData) {
    setIsLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signup", userData)
      .then((response) => {
        console.log(response);
        console.log(response?.data.data.token);
        if (response?.data.message === "account created") {
          setUserToken(response?.data.data.token);
          localStorage.setItem("tokens", response?.data.data.token);
          // ^navigate user to login page

          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setApiError(error?.response.data.message);
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <>
      <div className=" bg-sky-300 min-h-screen p-3 ">
        <div className=" w-1/2 bg-white rounded-md mx-auto p-5 shadow mt-10">
          <h2 className=" text-sky-600 font-bold text-center text-2xl">
            Register Now
          </h2>
          {/* // ^ form */}
          <form onSubmit={handleSubmit(submitForm)}>
            <div className=" flex flex-col gap-7 mt-5">
              {/* //^name */}
              <div>
                <Input
                  {...register("name")}
                  aria-label="Name"
                  className="w-full "
                  placeholder="Enter your name"
                />

                {formState?.errors?.name && formState.touchedFields.name ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState?.errors?.name?.message}
                  </p>
                ) : null}

                {/* ) : null} */}
              </div>
              {/* //^username */}
              <div>
                <Input
                  {...register("username")}
                  aria-label="userName"
                  className="w-full "
                  placeholder="Enter your userName"
                />

                {formState?.errors.username &&
                formState?.touchedFields.username ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState?.errors.username?.message}
                  </p>
                ) : null}

                {/* ) : null} */}
              </div>
              {/* //^ email */}
              <div>
                <Input
                  type="email"
                  {...register("email")}
                  aria-label="Email"
                  className="w-full "
                  placeholder="Enter your Email"
                />
                {formState?.errors?.email && formState.touchedFields.email ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState?.errors?.email?.message}
                  </p>
                ) : null}
              </div>
              {/* // ^password */}
              <div>
                <Input
                  {...register("password")}
                  type="password"
                  aria-label="Password"
                  className="w-full"
                  placeholder="Enter your Password"
                />
                {formState?.errors?.password &&
                formState?.touchedFields.password ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState.errors.password?.message}
                  </p>
                ) : null}
              </div>
              {/* // ^ repassword */}
              <div>
                <Input
                  {...register("rePassword")}
                  type="password"
                  aria-label="rePassword"
                  className="w-full "
                  placeholder="Enter your rePassword"
                />
                {formState.errors.rePassword &&
                formState.touchedFields.rePassword ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState.errors.rePassword?.message}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-4">
                {/* //^ dateofBirth */}
                <div className="w-full">
                  <Input
                    {...register("dateOfBirth")}
                    type="date"
                    aria-label="dateOfBirth"
                    className="w-full "
                    placeholder="Enter your dateOfBirth"
                  />
                  {formState.errors.dateOfBirth &&
                  formState.touchedFields.dateOfBirth ? (
                    <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                      {formState.errors.dateOfBirth?.message}
                    </p>
                  ) : null}
                </div>
                {/* // ^ gender */}
                <div className="w-full">
                  <select
                    {...register("gender")}
                    defaultValue={"Choose a Gender"}
                    className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                  >
                    <option value="">Choose a Gender </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formState.errors.gender && formState.touchedFields.gender ? (
                    <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                      {formState.errors.gender?.message}
                    </p>
                  ) : null}
                </div>
              </div>
              {/* //^ alert error */}
              {apiError ? (
                <div className="bg-red-500 text-white font-bold text-center rounded-md py-2 ">
                  {apiError}
                </div>
              ) : null}
              <Button
                type="submit"
                isDisabled={isLoading}
                className="w-full my-3"
              >
                {isLoading ? "Loading...." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
