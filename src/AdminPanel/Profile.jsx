import React from 'react'
import '../Style/Profile.css'
import { useAuth } from '../context/auth'
export const Profile = ({ setSelectedTab }) => {
  const [auth, setAuth] = useAuth();


  const auth1 = JSON.parse(localStorage.getItem('auth'));

  const handleCreateCompBlog = (key) => {
    setSelectedTab(key);
  };
  return (
    <div className='profile-container'>
      <div className='content-container'>


        <div className='profile-data'>

          <div>
           
            <p> <strong>Email</strong></p>
            <p> <strong>Role</strong></p>

          </div>


          <div>
            <p>: </p>
            <p>:</p>


          </div>
          <div>
            <p>{auth1?.user?.email}</p>
            <p>{auth1?.user?.role}</p>
          </div>
        </div>

      </div>

      <div className='btn-container'>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button className="create-compblog-btn" onClick={() => { handleCreateCompBlog("job") }}>
            Create Job
          </button>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button className="create-compblog-btn" onClick={() => { handleCreateCompBlog("blogs") }}>
            Create Blog
          </button>
        </div>



        {auth1?.user?.role === 'superAdmin' ? (<div style={{ marginTop: "20px", textAlign: "center" }}>
          <button className="create-compblog-btn" onClick={() => { handleCreateCompBlog("categories") }}>
            Create Category
          </button>
        </div>) : ("")}




      </div>


    </div>
  )
}
