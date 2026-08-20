import React, { useContext, useRef, useState } from "react";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../Schema/LoginSchema";
import { AuthContext } from "../../Contexts/AuthContext";

export default function Login() {
  //& controlled => control it by react  => useState
  //& uncontrolled => control it by dom  => Ref

  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setUserToken } = useContext(AuthContext);
  const { register, handleSubmit, setError, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  function submitForm(userData) {
    setIsLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signin", userData)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        if (response.data.message === "signed in successfully") {
          setUserToken(response.data.data.token);
          localStorage.setItem("token", response.data.data.token);
          // ^navigate user to login page

          navigate("home");
        }
      })
      .catch((error) => {
        console.log(error.response);
        setApiError(error.response.data.message);
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <>
      <div className=" bg-sky-300 min-h-screen p-3 ">
        <div className=" w-1/2 bg-white rounded-md mx-auto p-5 shadow mt-10">
          <h2 className=" text-sky-600 font-bold text-center text-2xl">
            Login Now
          </h2>
          {/* // ^ form */}
          <form onSubmit={handleSubmit(submitForm)}>
            <div className=" flex flex-col gap-7 mt-5">
              {/* //^ email */}
              <div>
                <Input
                  type="email"
                  {...register("email")}
                  aria-label="Email"
                  className="w-full "
                  placeholder="Enter your Email"
                />
                {formState.errors.email && formState.touchedFields.email ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState.errors.email?.message}
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
                {formState.errors.password &&
                formState.touchedFields.password ? (
                  <p className=" bg-sky-200 p-2 text-center text-red-500 font-bold rounded-md">
                    {formState.errors.password?.message}
                  </p>
                ) : null}
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
