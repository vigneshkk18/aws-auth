import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadUser, useAuth } from "@/hooks/useAuth";
import { signOut } from "aws-amplify/auth";
import { PowerOff } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const user = useAuth();

  if (!user) return null;

  const onSignOut = async () => {
    await signOut();
    loadUser();
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Home
            <Button onClick={onSignOut} variant="destructive">
              <PowerOff />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <h3>Pages</h3>
          <ul className="ml-6">
            <li className="list-disc">
              <Link className="hover:underline" to="/greet">
                Greeter
              </Link>
            </li>
            <li className="list-disc">
              <Link className="hover:underline" to="/infinite-load">
                Infinite Load
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
