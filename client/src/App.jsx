import Login from "./components/Login"
import Register from "./components/Register"
import HomePage from "./components/HomePage"
import { Routes, BrowserRouter as Router, Route } from "react-router-dom"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={Login} />
        <Route exact path="/register" Component={Register} />
      </Routes>
    </Router>
  )
}
