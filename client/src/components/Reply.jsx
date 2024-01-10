import React, { useContext } from "react"
import Avatar from "react-avatar"
import { Link } from "react-router-dom"
import { MyContext } from "../MyContext"
import axios from "axios"
import { toast } from "react-toastify"

function Reply({ reply, singleTweetDetail, tweet_id }) {
  const { user } = useContext(MyContext)
  const handleDelete = async () => {
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_URL}/reply/${reply._id}/delete`,
        {
          tweet_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token
          }
        }
      )
      if (result.status === 200) {
        toast(result.data.result)
        singleTweetDetail()
      }
    } catch (error) {
      toast("Something went wrong")
      console.log(error)
    }
  }
  const dobDate = new Date(reply.createdAt)
  const DOB = dobDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

  return (
    <div>
      <div className="flex mx-3 p-2 hover:bg-[#E1F5FE] hover:rounded-md border-t mt-1">
        <div className=" bg-slate-300 text-center  rounded-[50%] overflow-hidden w-12 h-12">
          {reply.repliedBy?.picture?.url ? (
            <img
              className="object-cover"
              src={reply.repliedBy?.picture?.url}
              alt=""
            />
          ) : (
            <Avatar
              name={reply.repliedBy?.name}
              round
              color="#60a5fa"
              size="48px"
            />
          )}
        </div>
        <div className="flex flex-col ms-3 w-full">
          <p className="flex justify-between">
            <span>
              <Link
                to={`/profile/${reply.repliedBy?._id}`}
                className="hover:underline"
              >
                <span className="font-semibold me-1">
                  @{reply.repliedBy?.username}
                </span>
              </Link>
              <span className="text-slate-400 inline-block align-middle me-1">
                {" "}
                .{" "}
              </span>
              <span className="font-light text-slate-400">{DOB}</span>
            </span>
            {user.user?._id === reply.repliedBy?._id ? (
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
            ) : null}
          </p>
          <p className="mb-1">{reply.comment}</p>
        </div>
      </div>
    </div>
  )
}

export default Reply
