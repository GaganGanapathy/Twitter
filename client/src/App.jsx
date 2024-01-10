import { useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import HomePage from "./components/HomePage"
import { Routes, BrowserRouter as Router, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { MyContext } from "./MyContext"
import Profile from "./components/Profile"

export default function App() {
  const [user, setUser] = useState(null)
  return (
    <MyContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route exact path="/" Component={Login} />
          <Route exact path="/register" Component={Register} />
          <Route exact path="/home" Component={HomePage} />
          <Route exact path="/profile/:id" Component={Profile} />
        </Routes>
        <ToastContainer pauseOnHover={false} />
      </Router>
    </MyContext.Provider>
  )
}
