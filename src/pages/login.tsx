import ConfigureAuthenticator from "@/components/configure-authenticator";
import LoginForm from "@/components/login-form";
import { Verification } from "@/components/verfication";
import { loadUser } from "@/hooks/useAuth";
import { confirmSignIn, type SignInOutput } from "aws-amplify/auth";
import { useState } from "react";

export type NextStep =
  | (SignInOutput["nextStep"] & {
      userDetails?: { email: string };
    })
  | undefined;

export default function Login() {
  const [nextStep, setNextStep] = useState<NextStep>();

  const onCancel = () => setNextStep(undefined);

  const onVerify = async (totp: string) => {
    await confirmSignIn({
      challengeResponse: totp,
    });
    setNextStep(undefined);
    loadUser();
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      {nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE" ? (
        <Verification
          title="Additional verification required"
          description="Enter the 6 digit code you received in your authenticator app."
          onConfirm={onVerify}
          cancel={onCancel}
        />
      ) : nextStep?.signInStep === "CONTINUE_SIGN_IN_WITH_TOTP_SETUP" ? (
        <ConfigureAuthenticator
          nextStep={nextStep}
          openNextSignInStep={setNextStep}
        />
      ) : (
        <LoginForm openNextSignInStep={setNextStep} />
      )}
    </main>
  );
}
