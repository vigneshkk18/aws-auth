import { Switch } from "wouter";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
import { PrivateRoute } from "@/privateroute";
import { ThemeProvider } from "@/components/theme-provider";
import "./Auth/setupAuth";
import { PublicRoute } from "@/publicroute";

function App() {
  return (
    <ThemeProvider>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/signup" component={Signup} />
        <PrivateRoute component={Home} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
