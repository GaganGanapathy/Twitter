import React, { useState, useContext, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MyContext } from "../MyContext"
import axios from "axios"

function Tweet({ _id, getTweets }) {
  const { user } = useContext(MyContext)
  const [tweet, setTweet] = useState({})

  const singleTweetDetail = async () => {
    const tweet = await axios.get(`${import.meta.env.VITE_URL}/tweet/${_id}`)
    setTweet(tweet.data.result)
  }

  useEffect(() => {
    singleTweetDetail()
  }, [])

  const like = tweet.likes?.some((item) => item._id === user.user._id)

  const handleDelete = async () => {
    try {
      const result = await axios.delete(
        `${import.meta.env.VITE_URL}/tweet/${_id}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + user.token
          }
        }
      )
      toast(result.data.result)
      getTweets()
    } catch (error) {
      toast("Something went wrong")
      console.log(error)
    }
  }

  const handleLike = async () => {
    try {
      if (like) {
        const result = await axios.put(
          `${import.meta.env.VITE_URL}/tweet/${_id}/dislike`,
          { _id },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + user.token
            }
          }
        )
        if (result.status === 200) {
          toast(result.data.result)
        }
      } else {
        const result = await axios.put(
          `${import.meta.env.VITE_URL}/tweet/${_id}/like`,
          { _id },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + user.token
            }
          }
        )
        if (result.status === 200) {
          toast(result.data.result)
        }
      }
      singleTweetDetail()
    } catch (error) {
      toast("Something went wrong")
      console.log(error)
    }
  }
  return (
    <>
      <div className="w-full border justify-center p-2 flex flex-col hover:bg-[#E1F5FE]">
        <div className="ms-12 font-light text-slate-600 flex">
          <span className="me-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="text-slate-400 w-5 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
          </span>
          <span>Reposted by john</span>
        </div>
        <div className="flex">
          <div className=" bg-slate-300 text-center  rounded-[50%] overflow-hidden w-14 h-14">
            <img
              className="object-cover"
              src="https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFuaW1lfGVufDB8fDB8fHww"
              alt=""
            />
          </div>
          <div className="flex flex-col ms-3 w-full">
            <p className="flex justify-between">
              <span>
                <span className="font-semibold me-1">@John</span>
                <span className="text-slate-400 inline-block align-middle me-1">
                  {" "}
                  .{" "}
                </span>
                <span className="font-light text-slate-400">Date</span>
              </span>
              <button className="me-2" onClick={handleDelete}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </p>
            <p className="mb-1">{tweet.content}</p>
            {tweet.image && (
              <img className="w-80 h-80" src={tweet.image.url} alt="" />
            )}
            <div className="p-1 flex">
              <p className="flex me-3">
                <button onClick={handleLike}>
                  {like ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-red-600 w-6 h-6"
                    >
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="text-red-600 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-lg ms-1">{tweet.likes?.length}</span>
              </p>
              <p className="flex me-3">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="text-blue-500  w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                    />
                  </svg>
                </button>
                <span className="text-lg ms-1">3</span>
              </p>
              <p className="flex">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="text-blue-500 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                    />
                  </svg>
                </button>
                <span className="text-lg ms-1">3</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Tweet
