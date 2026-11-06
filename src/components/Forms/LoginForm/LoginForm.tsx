"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { loginSchema } from "@/utils/authValidation";
import { useRouter } from "next/navigation";
import { signinUser } from "@/redux/api";
import styles from "./LoginForm.module.css";

type FormData = Yup.InferType<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signinUser(data);
      router.push("/recommended");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const getInputGroupClass = (fieldName: keyof FormData) => {
    if (errors[fieldName])
      return `${styles.inputGroup} ${styles.inputGroupError}`;
    if (touchedFields[fieldName] && !errors[fieldName])
      return `${styles.inputGroup} ${styles.inputGroupSuccess}`;
    return styles.inputGroup;
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo}>
          <svg width="42" height="17">
            <use href="/icons.svg#icon-logo" />
          </svg>
          <span className={styles.logoText}>READ JOURNEY</span>
        </div>

        <h1 className={styles.title}>
          Expand your <br />
          mind, reading <br />
          <span className={styles.titleSecondary}>a book</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className="fieldWrapper">
            <div className={getInputGroupClass("email")}>
              <span className={styles.label}>Mail:</span>
              <input
                type="email"
                placeholder=""
                className={styles.inputText}
                {...register("email")}
              />
              {errors.email && (
                <svg
                  width="20"
                  height="20"
                  className={`${styles.statusIcon} ${styles.statusIconError}`}
                >
                  <use href="/icons.svg#icon-pajamas-error" />
                </svg>
              )}
              {!errors.email && touchedFields.email && (
                <svg
                  width="20"
                  height="20"
                  className={`${styles.statusIcon} ${styles.statusIconSuccess}`}
                >
                  <use href="/icons.svg#icon-check-ok" />
                </svg>
              )}
            </div>

            {errors.email && (
              <p className={styles.messageError}>{errors.email.message}</p>
            )}
          </div>

          <div className="fieldWrapper">
            <div className={getInputGroupClass("password")}>
              <span className={styles.label}>Password:</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className={`${styles.inputText} ${styles.inputPassword}`}
                {...register("password")}
              />
              <div className={styles.passwordIcons}>
                {errors.password && (
                  <svg
                    width="20"
                    height="20"
                    className={`${styles.statusIcon} ${styles.statusIconError}`}
                  >
                    <use href="/icons.svg#icon-pajamas-error" />
                  </svg>
                )}
                {!errors.password && touchedFields.password && (
                  <svg
                    width="20"
                    height="20"
                    className={`${styles.statusIcon} ${styles.statusIconSuccess}`}
                  >
                    <use href="/icons.svg#icon-check-ok" />
                  </svg>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                >
                  <svg width="20" height="20" className={styles.eyeIcon}>
                    <use
                      href={`/icons.svg#${showPassword ? "icon-open-eye" : "icon-close-eye"}`}
                    />
                  </svg>
                </button>
              </div>
            </div>
            {errors.password && (
              <p className={styles.messageError}>
                {errors.password?.message as string}
              </p>
            )}
            {!errors.password && touchedFields.password && (
              <p className={styles.messageSuccess}>Password is secure</p>
            )}
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              Log In
            </button>
            <Link href="/register" className={styles.link}>
              Dont have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
