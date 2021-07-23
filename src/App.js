// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./components/Home";
import Switcher from "./components/Switcher";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/About";
import Error from "./components/Error";

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
          <Route path="*">
            <Error error={{ code: 404, message: "Page not found" }} />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
