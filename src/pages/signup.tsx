import { EmailVerification } from "@/components/email-verfication";
import { SignupForm } from "@/components/signup-form";
import type { AuthUser } from "aws-amplify/auth";
import { useState } from "react";

export default function Signup() {
  const [emailVerification, setEmailVerification] = useState({
    show: false,
    userDetails: null as AuthUser | null,
  });

  const showEmailVerification = (userDetails: AuthUser) =>
    setEmailVerification({ show: true, userDetails });
  const hideEmailVerification = () =>
    setEmailVerification({ show: false, userDetails: null });

  return (
    <main className="w-full h-full flex items-center justify-center">
      {emailVerification.show && emailVerification.userDetails ? (
        <EmailVerification
          userDetails={emailVerification.userDetails}
          cancel={hideEmailVerification}
        />
      ) : (
        <SignupForm showEmailVerification={showEmailVerification} />
      )}
    </main>
  );
}
