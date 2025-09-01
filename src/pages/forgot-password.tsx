import { useLocation } from "wouter";
import { confirmResetPassword } from "aws-amplify/auth";
import { EmailVerification } from "@/components/email-verfication";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { useState } from "react";
import type { UserDetails } from "@/types/auth";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [emailVerification, setEmailVerification] = useState({
    show: false,
    userDetails: null as UserDetails | null,
  });

  const showEmailVerification = (userDetails: UserDetails) =>
    setEmailVerification({ show: true, userDetails });
  const hideEmailVerification = () =>
    setEmailVerification({ show: false, userDetails: null });

  const onConfirm = async (code: string) => {
    if (!emailVerification.userDetails) return;
    await confirmResetPassword({
      confirmationCode: code,
      username: emailVerification.userDetails.username,
      newPassword: emailVerification.userDetails.password!,
    });
    navigate("/login");
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      {emailVerification.show && emailVerification.userDetails ? (
        <EmailVerification
          cancel={hideEmailVerification}
          onConfirm={onConfirm}
        />
      ) : (
        <ForgotPasswordForm showEmailVerification={showEmailVerification} />
      )}
    </main>
  );
}
