import { Button } from "@/components/ui/button";
import { loadUser, useAuth } from "@/hooks/useAuth";
import { signOut } from "aws-amplify/auth";

export default function Home() {
  const user = useAuth();

  if (!user) return null;

  const onSignOut = async () => {
    await signOut();
    loadUser();
  };

  return (
    <div>
      <pre> Hello: {user?.signInDetails?.loginId} </pre>
      <pre> Auth flow type: {user?.signInDetails?.authFlowType} </pre>
      <pre> Signin Details: {JSON.stringify(user.signInDetails)} </pre>
      <pre> Page Title: {document.title}</pre>

      <Button onClick={onSignOut}>Sign out</Button>
    </div>
  );
}
