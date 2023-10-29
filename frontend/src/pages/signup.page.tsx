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
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { z } from "zod";

const SignupSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Please enter a valid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
  username: z.string({
    required_error: "Username is required",
  }),
});

type SignupInput = z.infer<typeof SignupSchema>;

const SignUp = () => {
  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  });
  const navigate = useNavigate();

  const response = useMutation({
    mutationFn: async (data: SignupInput) => {
      const url = new URL("/api/v1/users/signup", import.meta.env.VITE_API_URI);
      const response = await axios.post(url.toString(), {
        ...data,
      });
      return response.data;
    },
  });

  const onSubmit = (data: SignupInput) => {
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
      navigate("/login");
    }
  };

  return (
    <div className="w-full pt-10 flex items-center justify-center">
      <Toaster />
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          <p className="text-center">or</p>
          <Button type="button" variant="secondary">
            <Link to="/login">Login</Link>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
