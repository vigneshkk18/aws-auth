import { useAuth } from "@/hooks/useAuth";
import {
  Redirect,
  Route,
  type DefaultParams,
  type PathPattern,
  type RouteProps,
} from "wouter";

export function PrivateRoute<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends PathPattern = PathPattern
>(props: RouteProps<T, RoutePath>) {
  const user = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
}
