import React from "react";
import berry1 from "../components/png/berry1.png";
import berry2 from "../components/png/berry1.png";
import Navbar from "../components/layout/Navbar.jsx";
import { Link,useNavigate} from "react-router-dom";
import { api } from "../utils/axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useMemo } from "react";  


const floatingPNGs = [
  berry1,
  berry2,
  berry1,
  berry2,
  berry1,
  berry2,
  berry1,
  berry2,
];

const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);

  return { top: `${top}%`, left: `${left}%` };
};


const SignUp = () => {
  const navigate = useNavigate()

  const [formData , setFormData ] = useState({
    userName :'',
    email : '',
    password : ''
  })
  const [pending , setPending ] = useState(false)



const randomPositions = useMemo(() => {
  return floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: Math.random() * 60 + 40,
    duration: Math.random() * 6 + 6,
  }));
}, []);


  const handleSubmit = async () =>{
    try{
      
      setPending(true)
      const dataSubmitToSignUp = await api.post('/api/auth/signup',formData)
      setPending(false)
      toast.success(dataSubmitToSignUp.data.success)
      setTimeout(()=>{
        useNavigate('/login')
      },2000)

      
    }catch ( error ){
      console.log ( " error in signing Up ", error )
      toast.error(`${error.status} ${error.response.data.error}`)
      setPending(false)

    }
    setFormData({
    userName :'',
    email : '',
    password : ''
  })
  }



  return (
    <>
      <Navbar />
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center font-poppins 
                    bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] 
                    relative overflow-hidden  "
      >
        {floatingPNGs.map((png, i) => (
          <img
            key={i}
            src={png}
            alt={`floating-${i}`}
            className="absolute animate-floatGlow"
            style={{
              top: randomPositions[i].top,
              left: randomPositions[i].left,
              width: randomPositions[i].size,
              height: randomPositions[i].size,
              animationDuration: `${randomPositions[i].duration}s`,
              filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))",
            }}
          />
        ))}
        <div className=" px-6  py-5 mt-20 flex gap-6 rounded-2xl shadow-lg bg-gray-400 w-[40vw]  bg-transparent backdrop-blur-2xl flex-col justify-center items-center ">
          <h1
            className=" bg-clip-text text-transparent 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                     hover:scale-110 transition-transform duration-300 ease-in-out
                     drop-shadow-lg text-3xl font-poppins font-bold"
          >
            SignUp
          </h1>

          <div className="flex flex-col gap-12">
             <div className=" flex flex-col gap-2">

            <input
              className="rounded-2xl focus:scale-110 transition-transform duration-300  text-transparent bg-clip-text 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500  bg-transparent border-2 h-8 w-96 p-5 "
              placeholder="Enter Username"
              type="text" value={formData.userName} onChange={(e)=>setFormData((prev)=>({...prev,userName:e.target.value}))}
            />
            <p className=" text-transparent bg-clip-text ml-2 text-sm
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 " >* userName Must be atleast of 6 chars
                     </p>
            </div>

          
            <input
              className="rounded-2xl focus:scale-110 transition-transform duration-300  text-transparent bg-clip-text 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500  bg-transparent border-2 h-8 w-96 p-5 "
              placeholder="Enter email"
              type="email"  value={formData.email} onChange={(e)=>setFormData((prev)=>({...prev,email:e.target.value}))}
            />


           <div className="flex flex-col gap-2">

            <input
              className="rounded-2xl focus:scale-110 transition-transform duration-300 bg-transparent text-transparent bg-clip-text 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 border-2 h-8 w-96 p-5"
              placeholder="Enter password"
              type="password"  value={formData.password} onChange={(e)=>setFormData((prev)=>({...prev,password:e.target.value}))}
            />
            
            <p className=" text-transparent bg-clip-text ml-2 text-sm
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 " >* password Must be atleast of 6 chars
                     </p>

            </div>

          </div>

          <button onClick={handleSubmit}
            className=" bg-clip-text text-transparent 
                     bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                     hover:scale-110 transition-transform duration-300 ease-in-out
                     drop-shadow-lg text-xl  font-poppins font-bold "
          >
           {
            pending ? <>Submiiting ...</> : <>Submit</>
           }
          </button>
          <p className="text-md font-poppins font-bold drop-shadow-lg">
            <span
              className="bg-clip-text text-transparent 
                   bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
                   transition-transform duration-300 ease-in-out"
            >
              Have previous account?
            </span>
            <Link
              to="/login"
              className="ml-2 inline-block bg-clip-text text-transparent 
               bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 
               transition-transform duration-300 ease-in-out hover:scale-110"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
