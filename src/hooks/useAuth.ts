import {
  getCurrentUser,
  fetchAuthSession,
  type AuthUser,
} from "aws-amplify/auth";
import { useSyncExternalStore } from "react";

interface User extends AuthUser {
  authToken: string;
}

let user: User | null = null;
let listeners: Array<() => void> = [];

const authStore = {
  subscribe(cb: () => void) {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  },
  getSnapshot() {
    return user;
  },
  emitChange() {
    for (const listener of listeners) {
      listener();
    }
  },
};

export async function loadUser() {
  try {
    const [authUser, authSession] = await Promise.all([
      getCurrentUser(),
      fetchAuthSession(),
    ]);
    const authToken = authSession.tokens?.idToken?.toString();
    if (!authUser || !authToken) {
      throw new Error("Failed to authenticate user");
    }
    user = {
      ...authUser,
      authToken,
    };
  } catch (error: unknown) {
    user = null;
    console.error(error);
  } finally {
    authStore.emitChange();
  }
}

export const useAuth = () =>
  useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
