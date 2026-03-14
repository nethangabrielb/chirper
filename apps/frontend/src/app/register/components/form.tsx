"use client";

import { RegisterSchema } from "@/app/register/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FormButton } from "@/components/button";
import { InputSharp } from "@/components/input";

import { cn } from "@/lib/utils";

// apply zod schema to ts interface
export type Register = z.infer<typeof RegisterSchema>;

const RegisterForm = () => {
  const [passwordFormatStatus, setPasswordFormatStatus] = useState<{
    length: null | boolean;
    capital: null | boolean;
    special: null | boolean;
  }>({
    length: null,
    capital: null,
    special: null,
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    reValidateMode: "onBlur",
  });
  const mutation = useMutation({
    mutationFn: async (data: Register) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (res) {
        const data = await res.json();
        if (data.status === "success") {
          router.push("/login");
        }
        toast.success("Registered successfully", {
          description: "You may login now with your new account",
        });
      } else {
        toast.error(
          "There was a problem sending a request to the server. Please try again",
        );
      }
    },
  });

  const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target?.value;

    if (val.length < 8) {
      setPasswordFormatStatus((prevFormat) => ({
        ...prevFormat,
        length: false,
      }));
    }
    if (val.length >= 8) {
      setPasswordFormatStatus((prevFormat) => ({
        ...prevFormat,
        length: true,
      }));
    }

    if (/[A-Z]/.test(val) === false) {
      setPasswordFormatStatus((prevFormat) => ({
        ...prevFormat,
        capital: false,
      }));
    }
    if (/[A-Z]/.test(val) === true) {
      setPasswordFormatStatus((prevFormat) => ({
        ...prevFormat,
        capital: true,
      }));
    }

    if (/[^A-Za-z0-9]/.test(val) === false) {
      setPasswordFormatStatus((prevFormat) => ({
        ...prevFormat,
        special: false,
      }));
    }

    if (/[^A-Za-z0-9]/.test(val) === true) {
      setPasswordFormatStatus((prevFormat) => ({
        ...prevFormat,
        special: true,
      }));
    }
  };

  const submitForm = () => {
    const values = getValues();
    mutation.mutate(values);
  };

  return (
    <main className="flex flex-col">
      <div className="flex justify-between w-full gap-4 sm:gap-8 items-end">
        <h1 className="font-extrabold text-2xl lg:text-4xl tracking-tighter rotate-x-[35deg]">
          Create your account
        </h1>
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:underline underline-offset-4"
        >
          ← Return
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="flex flex-col gap-8 w-full"
      >
        <InputSharp
          label="name"
          register={register}
          errorMessage={errors.name?.message}
        ></InputSharp>
        <InputSharp
          label="username"
          register={register}
          errorMessage={errors.username?.message}
        ></InputSharp>
        <div className="flex flex-col gap-2">
          <InputSharp
            label="email"
            register={register}
            errorMessage={errors.email?.message}
          ></InputSharp>
          <p className="text-neutral-400 font-light text-sm">
            I'll use this for the system to contact you and prevent spams or
            something. No worries I will not share your email with anyone else.
          </p>
        </div>
        <InputSharp
          label="password"
          register={register}
          errorMessage={errors.password?.message}
          displayErrMessage={false}
          onChange={passwordChangeHandler}
          type="password"
        ></InputSharp>
        <InputSharp
          label="confirmPassword"
          register={register}
          errorMessage={errors.confirmPassword?.message}
          displayErrMessage={true}
          type="password"
        ></InputSharp>
        <div className="flex flex-col gap-[1px] text-sm font-light text-neutral-300 -translate-y-4">
          <p
            className={cn(
              "flex items-center",
              errors.password?.type === "too_small" && "text-red-600",
              passwordFormatStatus.length && "text-green-600",
            )}
          >
            {errors.password?.type === "too_small" && (
              <X
                size={18}
                color="red"
                className={cn(passwordFormatStatus.length && "hidden")}
              ></X>
            )}
            {passwordFormatStatus.length && (
              <Check size={18} color="green"></Check>
            )}
            Password must have at least 8 characters (e.g. "Strong2!")
          </p>
          <p
            className={cn(
              "flex items-center",
              errors.password?.message === "special char" && "text-red-600",
              passwordFormatStatus.special && "text-green-600",
            )}
          >
            {errors.password?.message === "special char" && (
              <X
                size={18}
                color="red"
                className={cn(passwordFormatStatus.special && "hidden")}
              ></X>
            )}
            {passwordFormatStatus.special && (
              <Check size={18} color="green"></Check>
            )}
            Password must contain at least 1 special character (e.g. "@", "#",
            "!", "?")
          </p>
          <p
            className={cn(
              "flex items-center",
              errors.password?.message === "one capital" && "text-red-600",
              passwordFormatStatus.capital && "text-green-600",
            )}
          >
            {errors.password?.message === "one capital" && (
              <X
                size={18}
                color="red"
                className={cn(passwordFormatStatus.capital && "hidden")}
              ></X>
            )}
            {passwordFormatStatus.capital && (
              <Check size={18} color="green"></Check>
            )}
            Password must have at least 1 capital letter
          </p>
        </div>
        <FormButton className="p-3! text-lg" disabled={mutation.isPending}>
          {mutation.isPending ? "Processing..." : "Register"}
        </FormButton>
      </form>
    </main>
  );
};

export default RegisterForm;
