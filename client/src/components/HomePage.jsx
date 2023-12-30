import React from "react"
import Sidebar from "./Sidebar"
import Home from "./Home"

function HomePage() {
  return (
    <div className="flex">
      <Sidebar />
      <Home />
    </div>
  )
}

export default HomePage
