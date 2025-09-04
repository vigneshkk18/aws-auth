import { loadUser } from "@/hooks/useAuth";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_USER_POOL_DOMAIN,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: ["http://localhost:5173"],
          redirectSignOut: ["http://localhost:5173/login"],
          providers: ["Google"],
          responseType: "code",
        },
      },
    },
  },
});
loadUser();

export {};
