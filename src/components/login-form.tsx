import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChromeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signIn, signInWithRedirect } from "aws-amplify/auth";
import { loadUser } from "@/hooks/useAuth";
import type { NextStep } from "@/pages/login";

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
      "Password must contain at least one uppercase letter, one number, and one special character"
    ),
});

interface LoginFormProps {
  openNextSignInStep: (signInStep: NextStep) => void;
}

export default function LoginForm({ openNextSignInStep }: LoginFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await signIn({
        username: values.email,
        password: values.password,
      });
      switch (res.nextStep.signInStep) {
        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
          openNextSignInStep(res.nextStep);
          break;
        case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
          openNextSignInStep({
            ...res.nextStep,
            userDetails: { email: values.email },
          });
          break;
        case "DONE":
          loadUser();
      }
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  const onSignInWithGoogle = async () => {
    signInWithRedirect({
      provider: "Google",
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link className="hover:underline" href="/signup">
            Sign Up
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
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
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Link className="hover:underline" to="/forgot-password">
                  forgot password?
                </Link>
              </div>
              <Button type="submit">Login</Button>
            </div>
            <div className="w-full border-t border-t-gray-50/10 my-2 relative">
              <span className="absolute top-1/2 left-1/2 -translate-1/2 z-10 bg-card p-2">
                Or
              </span>
            </div>
            <Button onClick={onSignInWithGoogle} type="button">
              <ChromeIcon /> Continue With Google
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
