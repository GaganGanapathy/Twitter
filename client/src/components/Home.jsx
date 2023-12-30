import React from "react"
import Tweet from "./Tweet"

function Home() {
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
                <div className="modal-body">
                  <form>
                    <textarea
                      name="content"
                      id="content"
                      rows="5"
                      className="w-full border rounded-sm p-1"
                      placeholder="Content"
                    ></textarea>
                    <input type="file" name="profile" id="profile" />
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
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
