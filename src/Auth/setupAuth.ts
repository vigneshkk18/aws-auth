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
          redirectSignIn: [import.meta.env.VITE_AWS_REDIRECT_SIGNIN],
          redirectSignOut: [import.meta.env.VITE_AWS_REDIRECT_SIGNOUT],
          providers: ["Google"],
          responseType: "code",
        },
      },
    },
  },
  API: {
    REST: {
      api: {
        endpoint: import.meta.env.VITE_AWS_API_ENDPOINT,
        region: import.meta.env.VITE_AWS_API_ENDPOINT_REGION,
      },
    },
  },
});
loadUser();

export {};
