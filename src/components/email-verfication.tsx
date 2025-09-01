import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  verificationCode: z.string().length(6, "Code must be 6 digits long"),
});

interface EmailVerificationProps {
  cancel: () => void;
  onConfirm: (code: string) => void;
}

export function EmailVerification({
  onConfirm,
  cancel,
}: EmailVerificationProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onConfirm(values.verificationCode);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify your account</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      {...field}
                      containerClassName="justify-center"
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={cancel} variant="ghost">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
