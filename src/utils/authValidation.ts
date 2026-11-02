import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid Email (must include @)")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Enter a valid Password")
    .required("Password is required"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid Email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});
