/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_AWS_USER_POOL_ID: string;
  readonly VITE_AWS_USER_POOL_CLIENT_ID: string;
  readonly VITE_AWS_USER_POOL_DOMAIN: string;
  readonly VITE_AWS_REDIRECT_SIGNIN: string;
  readonly VITE_AWS_REDIRECT_SIGNOUT: string;
  readonly VITE_AWS_API_ENDPOINT: string;
  readonly VITE_AWS_API_ENDPOINT_REGION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
