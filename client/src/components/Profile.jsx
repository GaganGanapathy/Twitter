import React, { useState, useContext, useEffect } from "react"
import Sidebar from "./Sidebar"
import axios from "axios"
import { MyContext } from "../MyContext"
import Tweet from "./Tweet"
import Avatar from "react-avatar"
import { useParams } from "react-router-dom"
import { Modal, Button } from "react-bootstrap"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"

function Profile() {
  const { id } = useParams()
  const { user } = useContext(MyContext)
  const [userTweets, setUserTweets] = useState([])
  const [userDetails, setUserDetails] = useState({})
  const [follow, setFollow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showPic, setShowPic] = useState(false)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [pic, setPic] = useState({ preview: "", data: "" })
  const [date, setDate] = useState()
  // console.log(new Date(date.toJSON()).toUTCString())
  // console.log(new Intl.DateTimeFormat("en-GB").format(date))

  useEffect(() => {
    getTweets()
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_URL}/auth/user/${id}`
    )
    if (result.status === 200) {
      setUserDetails(result.data.result)
    }
  }

  const getTweets = async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_URL}/user/${id}/tweets`
    )
    if (result.status === 200) {
      setUserTweets(result.data.result)
    }
  }

  const closeEdit = () => setShowEdit(false)
  const closePic = () => setShowPic(false)

  const handleEdit = async () => {
    try {
      if (!name || !location || !date) {
        toast("One or more field is missing")
        return
      }
      const result = await axios.put(
        `${import.meta.env.VITE_URL}/user/edit`,
        {
          name,
          location,
          dob: date.toISOString()
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token
          }
        }
      )
      if (result.status === 200) {
        toast("Updated successfully")
        getUserDetails()
        setDate(null)
        setLocation("")
        setName("")
        closeEdit()
      }
    } catch (error) {
      toast("Something went wrong")
      console.log(error)
    }
  }

  const handleProfilePic = async (e) => {
    try {
      e.preventDefault()
      let formData = new FormData()
      if (pic.data) formData.append("profile", pic.data)
      const result = await axios.post(
        `${import.meta.env.VITE_URL}/user/uploadProfilePic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + user.token
          }
        }
      )
      if (result.status === 200) {
        setPic({ preview: "", data: "" })
        toast(result.data.result)
        closePic()
        getUserDetails()
      }
    } catch (error) {
      toast("Something went wrong")
      console.log(error)
    }
  }

  const handlePic = (e) => {
    setPic({
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    })
  }

  const handleFollowUnfollow = async () => {
    try {
      if (follow) {
        const result = await axios.put(
          `${import.meta.env.VITE_URL}/auth/user/${id}/unfollow`,
          { id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user.token
            }
          }
        )
        if (result.status === 200) {
          toast(`${result.data.result} ${userDetails.name}`)
          setFollow(false)
        }
      } else {
        const result = await axios.put(
          `${import.meta.env.VITE_URL}/auth/user/${id}/follow`,
          { id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + user.token
            }
          }
        )
        if (result.status === 200) {
          toast(`${result.data.result} ${userDetails.name}`)
          setFollow(true)
        }
      }
      getUserDetails()
    } catch (error) {
      console.log("FOllow Unfollow Error", error)
    }
  }

  const createdAtDate = new Date(userDetails.joined)
  // Format the date to only show the date part (day, month, year)
  const joiningDate = createdAtDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

  let DOB
  if (userDetails?.dob) {
    const dobDate = new Date(userDetails.dob)
    DOB = dobDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-2/4 border p-2 h-screen overflow-auto">
        <p className="font-medium text-2xl mb-2">Profile</p>
        <div className="flex h-1/3 ">
          <div className="flex items-end relative h-2/3 bg-blue-400 w-full">
            <div className="flex justify-between items-end w-full absolute -bottom-1/2">
              {userDetails.picture?.url ? (
                <div className="w-28 h-28 rounded-full overflow-hidden border ms-2">
                  <img src={userDetails.picture.url} className="object-cover" />
                </div>
              ) : (
                <Avatar name={userDetails.name} round color="#BA68C8" />
              )}
              {user.user._id === id ? (
                <div className="me-2 mt-2">
                  <Button
                    className="text-black py-1 px-3 me-2 border-2 border-blue-300 rounded-md"
                    onClick={() => setShowPic(true)}
                  >
                    Upload Profile Picture
                  </Button>
                  <Modal show={showPic} onHide={closePic}>
                    <Modal.Header closeButton>
                      <Modal.Title>Profile Picture</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                        id="profile"
                        className="hidden cursor-pointer"
                        onChange={handlePic}
                      />
                      {pic.preview && (
                        <div className="overflow-hidden">
                          <img
                            src={pic.preview}
                            alt=""
                            className="object-center w-40 h-40"
                          />
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={closePic}
                        className="bg-red-400 hover:bg-red-500 border-none"
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        className=" bg-blue-400 hover:bg-blue-500 border-none"
                        onClick={handleProfilePic}
                      >
                        Upload
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button
                    className="text-black py-1 border-2 border-black px-3 rounded-md "
                    onClick={() => setShowEdit(true)}
                  >
                    Edit
                  </Button>
                  <Modal show={showEdit} onHide={closeEdit}>
                    <Modal.Header closeButton>
                      <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <label htmlFor="name" className="block mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="border-2 border-gray-400 rounded-md w-2/3 mb-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label htmlFor="location" className="block mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        className="border-2 border-gray-400 rounded-md w-2/3 mb-2"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <label htmlFor="dob" className="block mb-1">
                        Date of Birth
                      </label>
                      <div className="border-2 border-gray-400 rounded-md w-2/3 mb-2">
                        <DatePicker
                          showIcon
                          toggleCalendarOnIconClick
                          selected={date}
                          onChange={(date) => setDate(date)}
                          id="dob"
                          className="focus:outline-none "
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={closeEdit}
                        className="bg-red-400 hover:bg-red-500 border-none"
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        className=" bg-blue-400 hover:bg-blue-500 border-none"
                        onClick={handleEdit}
                      >
                        Update
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              ) : (
                <div className="me-2 mt-2">
                  <button
                    className="bg-black text-white py-1 px-3 rounded-md"
                    onClick={handleFollowUnfollow}
                  >
                    {follow ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bio data */}
        <div className="my-2">
          <p className="font-medium">{userDetails.name}</p>
          <p className="font-extralight text-slate-400">
            @{userDetails.username}
          </p>
          <div className="flex my-2">
            <p className="flex">
              <span className="me-1">
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
                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
                  />
                </svg>
              </span>
              <span className="me-3 text-slate-400">
                {userDetails?.dob ? DOB : "DOB"}
              </span>
            </p>
            <p className="flex">
              <span className="me-1">
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
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </span>
              <span className="text-slate-400">
                {userDetails.location ? userDetails.location : "Location"}
              </span>
            </p>
          </div>
          <p className="flex">
            <span className="me-1">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
            </span>
            <span className="text-slate-400">
              {/* {new Intl.DateTimeFormat("en-GB").format(
                new Date(userDetails.joined)
              )} */}
              {joiningDate}
            </span>
          </p>
          <p className="mt-2">
            <span className="font-medium me-3">
              {userDetails.following?.length} following
            </span>
            <span className="font-medium">
              {userDetails.followers?.length} followers
            </span>
          </p>
        </div>
        <div>
          <p className="text-center font-medium text-xl">Tweets and Replies</p>
          <div className="border">
            {userTweets.map((tweet) => (
              <Tweet key={tweet._id} _id={tweet._id} getTweets={getTweets} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
