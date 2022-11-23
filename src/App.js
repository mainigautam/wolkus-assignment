import { Switch, Route } from "react-router-dom";
import ProtectedRoutes from "./Authorization/ProtectedRoutes";
import Login from "./Authorization/Login";
import Register from "./Authorization/Register";
import './Styles/App.css';
import Home from './Components/Home'

function App() {
  return (
    <>
      <Switch>
      <ProtectedRoutes exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </>
  );
}

export default App;
