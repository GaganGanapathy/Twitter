import React, { useState, useContext } from "react"
import Tweet from "./Tweet"
import { MyContext } from "../MyContext"

function Home() {
  const [image, setImage] = useState("")

  const { user } = useContext(MyContext)

  const handleFiles = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]))
  }

  const handleTweet = async (e) => {
    try {
      e.preventDefault()
      console.log(e)
    } catch (error) {
      toast("Home Error")
    }
  }
  return (
    <div className="w-2/4 border ">
      <div className="px-4 pt-4 h-auto">
        {/* New Tweet */}
        <div className="flex justify-between mb-3">
          <p className="font-semibold ">Home</p>
          {/* <button className="bg-blue-500 text-white rounded-md px-8 py-1">
            Tweet
          </button> */}
          {/* Button trigger modal  */}
          <button
            type="button"
            className="bg-blue-500 text-white rounded-md px-8 py-1"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            tweet
          </button>

          {/* Modal  */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    New Tweet
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form>
                  <div className="modal-body pb-2">
                    <textarea
                      name="content"
                      id="content"
                      rows="5"
                      className="w-full border rounded-sm p-1 "
                      placeholder="Content"
                    ></textarea>
                    <label
                      htmlFor="profile"
                      className="mt-2 hover:cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 hover:text-blue-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </label>
                    <input
                      type="file"
                      name="profile"
                      id="profile"
                      className="hidden cursor-pointer"
                      onChange={handleFiles}
                    />
                    {image && (
                      <div className="overflow-hidden">
                        <img
                          src={image}
                          alt=""
                          className="object-center w-40 h-40"
                        />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn bg-red-400 hover:bg-red-500"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn bg-blue-400 hover:bg-blue-500"
                      onClick={handleTweet}
                    >
                      Tweet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Tweet />
      </div>
    </div>
  )
}

export default Home
