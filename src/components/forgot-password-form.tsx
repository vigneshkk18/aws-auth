import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loadUser } from "@/hooks/useAuth";
import type { UserDetails } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import z from "zod";

const formSchema = z.object({
  email: z.email(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
      "Password must contain at least one uppercase letter, one number, and one special character"
    ),
});

interface ForgotPasswordFormProps {
  showEmailVerification: (userDetails: UserDetails) => void;
}

export function ForgotPasswordForm({
  showEmailVerification,
}: ForgotPasswordFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      newPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await resetPassword({
        username: values.email,
      });
      switch (res.nextStep.resetPasswordStep) {
        case "CONFIRM_RESET_PASSWORD_WITH_CODE":
          showEmailVerification({
            username: values.email,
            password: values.newPassword,
          });
          break;
        case "DONE":
        default:
          loadUser();
          break;
      }
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your email below to reset your password
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Confirm</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
