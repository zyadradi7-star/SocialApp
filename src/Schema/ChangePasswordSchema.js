import * as zod from "zod";
import { data } from "react-router-dom";

export const ChangePasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, "Enter old Password")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Invalid Password",
      ),
    newPassword: zod
      .string()
      .min(1, "Enter new Password")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Invalid Password",
      ),
    conFirmPassword: zod.string().min(1, " conFirm Password "),
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.conFirmPassword, {
    message: "Passwords do not match",
    path: ["conFirmPassword"],
  });
