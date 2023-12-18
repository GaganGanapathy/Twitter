import React from "react"
import { Link } from "react-router-dom"

function Register() {
  return (
    <div className="h-screen flex  justify-center items-center bg-slate-100">
      <div className="flex flex-col md:flex-row rounded-md overflow-hidden shadow-xl">
        <div className="bg-blue-500 text-white flex flex-col justify-center items-center w-auto md:w-48 py-4 md:py-0">
          <h2 className="text-2xl mb-1">Join Us</h2>
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </div>
        </div>
        <form className="flex flex-col gap-y-2 px-3 py-6 bg-white">
          <h3 className="text-2xl font-medium">Register</h3>
          <input
            type="text"
            placeholder="Full Name"
            className="border-slate-400 border-[1px] rounded-md px-2 py-1 "
          />
          <input
            type="text"
            placeholder="Email"
            className="border-slate-400 border-[1px] rounded-md px-2 py-1 "
          />
          <input
            type="text"
            placeholder="Username"
            className="border-slate-400 border-[1px] rounded-md px-2 py-1 "
          />
          <input
            type="text"
            placeholder="Password"
            className="border-slate-400 border-[1px] rounded-md px-2 py-1 "
          />
          <button className="bg-black text-white rounded-md w-min px-2 py-1">
            Register
          </button>
          <p>
            Already Registered?{" "}
            <Link
              to="/register"
              className="text-blue-500 underline font-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
