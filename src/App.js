// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./components/Home";
import Switcher from "./components/Switcher";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/About";
import Error from "./components/Error";
import Dashboard from "./components/Dashboard";
import JoinedServer from "./components/JoinedServer";

function App() {
  const a = "Aye oh mate";
  return (
    <ChakraProvider>
      <Switcher />
      <Router>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/" exact>
            <Home a={a} />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/added-user">
            <JoinedServer message={{title:"User Joined", description:"Server has been added to your discord. Welcome to the Clan"}} />
          </Route>
          <Route path="/already-added-user">
            <JoinedServer message={{title:"User Already in server", description:"You are already in server why try again"}} />
          </Route>
          <Route path="*">
            <Error error={{ code: 404, message: "Page not found" }} />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
