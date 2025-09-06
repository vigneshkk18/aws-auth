import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAuthSession } from "aws-amplify/auth";
import { post } from "aws-amplify/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface ResponseBody {
  message: string;
}

export function Greet() {
  const [greetResponse, setGreetResponse] = useState<string>();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onReset = () => {
    form.reset();
    setGreetResponse(undefined);
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const token = (await fetchAuthSession()).tokens?.idToken?.toString();
    if (!token) return;
    const res = await post({
      apiName: "api",
      path: "/prod/greet",
      options: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name: values.name,
        },
      },
    }).response.then((r) => r.body.json() as unknown as Promise<ResponseBody>);
    setGreetResponse(res.message);
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Greeter{" "}
            <Link to="/">
              <Button variant="link" size="sm">
                Go back
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>Enter your name to get greeted</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {greetResponse && (
                <output className="text-green-800 rounded font-semibold p-1 px-2 bg-green-200 border border-green-800">
                  Response: {greetResponse}
                </output>
              )}
              <div className="flex justify-between">
                <Button type="button" onClick={onReset}>
                  Reset
                </Button>
                <Button type="submit">Greet</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
