import * as zod from "zod";

export const Registerschema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name Is Required")
      .min(4, "Min 4 Letter")
      .max(8, "Max 8 Letter"),

    username: zod
      .string()
      .nonempty("userName Is Required")
      .regex(/^[A-Z][a-z0-9]{5,}$/, "Invalid userName"),

    email: zod.string().nonempty("Email Is Required").email("Invalid Email"),
    password: zod
      .string()
      .nonempty("Password Is Required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Invalid Password",
      ),
    gender: zod.string().nonempty("Gender Is Required"),

    dateOfBirth: zod.coerce.date("Date is Required").refine((DateVal) => {
      const current = new Date().getFullYear();
      const year = DateVal.getFullYear();
      const age = current - year;
      return age > 20;
    }, "Age must be grater than 20"),
    rePassword: zod.string().nonempty("rePassword Is Required"),
  })
  .refine(
    (obj) => {
      if (obj.password === obj.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    { path: ["rePassword"], message: "Password and rePassword Not Match" },
  );
