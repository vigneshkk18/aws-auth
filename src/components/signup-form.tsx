import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loadUser } from "@/hooks/useAuth";
import type { UserDetails } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { autoSignIn, signUp } from "aws-amplify/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import z from "zod";

const formSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface SignupFormProps {
  showEmailVerification: (userDetails: UserDetails) => void;
}

export function SignupForm({ showEmailVerification }: SignupFormProps) {
  const [revealPassword, setRevealPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await signUp({
      username: values.email,
      password: values.password,
    });
    switch (res.nextStep.signUpStep) {
      case "CONFIRM_SIGN_UP":
        showEmailVerification({ username: values.email });
        break;
      case "COMPLETE_AUTO_SIGN_IN":
        await autoSignIn();
        loadUser();
        break;
      case "DONE":
        loadUser();
        break;
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create a account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
        <CardAction>
          <Link className="hover:underline" href="/login">
            Login
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={revealPassword ? "text" : "password"}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={revealPassword ? "text" : "password"}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex gap-2 items-center">
              <FormControl>
                <Checkbox
                  checked={revealPassword}
                  onCheckedChange={(checked) => setRevealPassword(!!checked)}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Show Password
              </FormLabel>
            </div>
            <Button type="submit">Signup</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
