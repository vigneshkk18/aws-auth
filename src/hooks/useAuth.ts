import { getCurrentUser, type AuthUser } from "aws-amplify/auth";
import { useSyncExternalStore } from "react";

let user: AuthUser | null = null;
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
    user = await getCurrentUser();
  } catch (error: unknown) {
    user = null;
    console.error(error);
  } finally {
    authStore.emitChange();
  }
}

export const useAuth = () =>
  useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
