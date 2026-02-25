"use client";

import { LoginSchema } from "@/app/login/schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FormButton } from "@/components/button";
import { InputSharp } from "@/components/input";

export type Login = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    setError,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });
  const mutation = useMutation({
    mutationFn: async (data: Login) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (res) {
        const data = await res.json();
        if (data.status === "success") {
          await queryClient.refetchQueries({ queryKey: ["user"] });
          router.replace("/home");
          router.refresh();
        } else {
          setError("username", { type: "custom", message: data.message });
          setError("password", { type: "custom", message: data.message });
        }
      } else {
        toast.error(
          "There was a problem sending a request to the server. Please try again",
        );
      }
    },
  });

  const submitForm = () => {
    const values = getValues();
    mutation.mutate(values);
  };
  return (
    <>
      <div className="flex justify-between items-end w-[70%]">
        <h1 className="font-extrabold text-center text-7xl tracking-tighter rotate-x-[35deg]">
          Login
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
        className="flex flex-col gap-8 w-[70%]"
      >
        <InputSharp
          label="username"
          register={register}
          errorMessage={errors.username?.message}
        ></InputSharp>
        <InputSharp
          label="password"
          register={register}
          errorMessage={errors.password?.message}
          type="password"
        ></InputSharp>
        <FormButton outline={false} className="p-3! text-lg">
          Login
        </FormButton>
      </form>
    </>
  );
};

export default LoginForm;
