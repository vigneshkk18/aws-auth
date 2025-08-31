import { useAuth } from "@/hooks/useAuth";
import {
  Redirect,
  Route,
  type DefaultParams,
  type PathPattern,
  type RouteProps,
} from "wouter";

export function PublicRoute<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends PathPattern = PathPattern
>(props: RouteProps<T, RoutePath>) {
  const user = useAuth();

  if (user) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
}
