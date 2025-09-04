import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toDataURL } from "qrcode";
import type { NextStep } from "@/pages/login";

interface ConfigureAuthenticatorProps {
  nextStep: NextStep;
  openNextSignInStep: (signInStep: NextStep | undefined) => void;
}

export default function ConfigureAuthenticator({
  nextStep,
  openNextSignInStep,
}: ConfigureAuthenticatorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();

  useEffect(() => {
    if (!nextStep || nextStep.signInStep !== "CONTINUE_SIGN_IN_WITH_TOTP_SETUP")
      return;
    const uri = nextStep.totpSetupDetails.getSetupUri(
      "test-auth-react-app",
      nextStep.userDetails?.email
    );

    toDataURL(uri.toString()).then(setQrCodeUrl);
  }, [nextStep]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Setup Multi Factor Authentication</CardTitle>
        <CardDescription>
          Scan this QRCode to setup your authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {!qrCodeUrl ? (
          <span>Loading...</span>
        ) : (
          <img src={qrCodeUrl} width={300} height={250} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => openNextSignInStep(undefined)} variant="ghost">
          Cancel
        </Button>
        <Button
          onClick={() =>
            openNextSignInStep({ signInStep: "CONFIRM_SIGN_IN_WITH_TOTP_CODE" })
          }
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
