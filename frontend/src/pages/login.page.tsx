import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Please enter a valid email",
    }),
  password: z.string({
    required_error: "Password is required",
  }),
});

type LoginInput = z.infer<typeof loginSchema>;

const Login = () => {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const response = useMutation({
    mutationFn: async (data: LoginInput) => {
      const url = new URL("/api/v1/users/login", import.meta.env.VITE_API_URI);
      const response = await axios.post<{ token: string }>(url.toString(), {
        ...data,
      });
      return response.data;
    },
  });

  const onSubmit = (data: LoginInput) => {
    response.mutate(data);
    if (response.isPending) {
      toast.loading("Logging in...");
    }
    if (response.isSuccess) {
      toast.success("Logged in successfully");
    }
    if (response.isError) {
      if (response.error instanceof AxiosError) {
        const err = response.error as AxiosError<{ message: string }>;
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
    if (response.isSuccess) {
      toast.success("Logged in successfully");
    }
  };

  useEffect(() => {
    if (response.data) {
      sessionStorage.setItem("token", response.data.token);
      navigate("/lists");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.data]);

  return (
    <div className="w-full pt-10 flex items-center justify-center">
      <Toaster richColors />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col text-left gap-3 border w-1/3 p-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <Button type="submit">Log in</Button>
          <p className="text-center">or</p>
          <Button type="button" variant="secondary">
            <Link to="/signup">Sign up</Link>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
