import { EmailVerification } from "@/components/email-verfication";
import { SignupForm } from "@/components/signup-form";
import type { UserDetails } from "@/types/auth";
import { confirmSignUp } from "aws-amplify/auth";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Signup() {
  const [emailVerification, setEmailVerification] = useState({
    show: false,
    userDetails: null as UserDetails | null,
  });
  const [, navigate] = useLocation();

  const showEmailVerification = (userDetails: UserDetails) =>
    setEmailVerification({ show: true, userDetails });
  const hideEmailVerification = () =>
    setEmailVerification({ show: false, userDetails: null });

  const onConfirm = async (code: string) => {
    if (!emailVerification.userDetails) return;
    await confirmSignUp({
      confirmationCode: code,
      username: emailVerification.userDetails?.username,
    });
    navigate("/login");
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      {emailVerification.show && emailVerification.userDetails ? (
        <EmailVerification
          onConfirm={onConfirm}
          cancel={hideEmailVerification}
        />
      ) : (
        <SignupForm showEmailVerification={showEmailVerification} />
      )}
    </main>
  );
}
