// import React, { useContext } from "react";
// import { AuthContext } from "../../Contexts/AuthContext";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import PostCard from "../PostCard/PostCard";
// import { RingLoader } from "react-spinners";
// import { Link, useNavigate } from "react-router-dom";
// import ChangePassword from "./../ChangePassword/ChangePassword";

// export default function Profile({ children }) {
//   const { userData } = useContext(AuthContext);
//   const navigate = useNavigate();

//   function getUserPosts() {
//     return axios.get(
//       `https://route-posts.routemisr.com/users/${userData?._id}/posts`,
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       },
//     );
//   }

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["getUserPosts"],
//     queryFn: getUserPosts,
//   });

//   console.log(data?.data.data.posts);
//   const posts = data?.data.data.posts;

//   if (isLoading) {
//     return (
//       <div className=" h-screen flex justify-center items-center">
//         <RingLoader color="blue" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className=" h-screen flex justify-center items-center">
//         <h2>{error?.message || "حدث خطأ غير متوقع"}</h2>
//       </div>
//     );
//   }

//   function getBirthDateWithAge(dateString) {
//     if (!dateString) return "N/A";

//     const birthDate = new Date(dateString);
//     const today = new Date();

//     // تنسيق التاريخ
//     const formattedDate = new Intl.DateTimeFormat("en-US", {
//       month: "long",
//       day: "numeric",
//       year: "numeric",
//     }).format(birthDate);

//     // حساب العمر
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();

//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }

//     return `${formattedDate} (${age} yrs)`;
//   }

//   // ^ حماية المكون في حال كانت البيانات ما زالت تحمل
//   if (!userData) {
//     return (
//       <div className="flex justify-center items-center min-h-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <button
//         onClick={() => navigate("/changePassword")}
//         className="bg-sky-500 py-3 px-4 rounded-2xl mt-5 ms-5 text-white font-bold cursor-pointer"
//       >
//         ChangePassword
//       </button>

//       <div className="max-w-2xl w-full mx-auto mt-8 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
//         {/* Cover Image Section */}
//         <div
//           className="h-48 bg-cover bg-center relative"
//           style={{
//             backgroundImage:
//               'url("https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max")',
//           }}
//         >
//           <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
//         </div>

//         {/* Profile Details Container */}
//         <div className="relative px-6 pb-6">
//           {/* Profile Picture */}
//           <div className="relative -mt-20 text-center">
//             <img
//               className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-lg object-cover ring-2 ring-blue-500/20"
//               src={userData?.photo || "https://via.placeholder.com/150"}
//               alt={userData?.name || "User Avatar"}
//             />
//           </div>

//           {/* User Basic Info */}
//           <div className="text-center mt-3">
//             <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
//               {userData?.name}
//             </h2>
//             <p className="text-sm font-medium text-blue-600 mt-1">
//               Software Engineer | UI/UX Designer
//             </p>
//             <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
//               Passionate about creating intuitive and beautiful web experiences.
//             </p>
//           </div>

//           {/* Stats Grid Section */}
//           <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 bg-gray-50/50 p-4 rounded-xl text-center">
//             {/* Followers */}
//             <div className="flex flex-col items-center justify-center border-r border-gray-200/60 last:border-0">
//               <span className="font-extrabold text-xl text-gray-800">
//                 {userData?.followersCount ?? 0}
//               </span>
//               <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
//                 Followers
//               </span>
//             </div>

//             {/* Following */}
//             <div className="flex flex-col items-center justify-center border-r border-gray-200/60 last:border-0">
//               <span className="font-extrabold text-xl text-gray-800">
//                 {userData?.followingCount ?? 0}
//               </span>
//               <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
//                 Following
//               </span>
//             </div>

//             {/* Date of Birth */}
//             <div className="flex flex-col items-center justify-center">
//               <span className="font-bold text-sm text-gray-800">
//                 {getBirthDateWithAge(userData?.dateOfBirth)}
//               </span>
//               <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
//                 Birthday
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-6 flex gap-3">
//             <button className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200">
//               Connect
//             </button>
//             <button className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200">
//               Message
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-5">
//         {posts?.map((post) => {
//           return <PostCard post={post} />;
//         })}
//       </div>
//     </>
//   );
// }

import React, { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../PostCard/PostCard";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
export default function Profile() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  function getUserPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${userData?._id}/posts`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getUserPosts", userData?._id],
    queryFn: getUserPosts,
    enabled: !!userData?._id,
  });

  const posts = data?.data?.data?.posts;

  function getBirthDateWithAge(dateString) {
    if (!dateString) return "N/A";
    const birthDate = new Date(dateString);
    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(birthDate);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return `${formattedDate} (${age} yrs)`;
  }

  if (isLoading || !userData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <RingLoader color="#2563eb" size={60} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 font-medium">
        <h2>{error?.message || "حدث خطأ غير متوقع"}</h2>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          {/* Cover Image */}
          <div
            className="h-48 bg-cover bg-center relative"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max")',
            }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Profile Info & Actions */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 text-center">
              <img
                className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-md object-cover ring-2 ring-blue-500/20"
                src={userData?.photo || "https://via.placeholder.com/150"}
                alt={userData?.name || "User Avatar"}
              />
            </div>

            {/* Text Details */}
            <div className="text-center mt-3">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {userData?.name}
              </h2>
              <p className="text-sm font-medium text-blue-600 mt-0.5">
                Software Engineer | Frontend Devloper
              </p>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                Passionate about creating intuitive and beautiful web
                experiences.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 bg-gray-50/60 p-4 rounded-xl text-center">
              <div className="flex flex-col items-center justify-center border-r border-gray-200/60">
                <span className="font-extrabold text-xl text-gray-800">
                  {userData?.followersCount ?? 0}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
                  Followers
                </span>
              </div>

              <div className="flex flex-col items-center justify-center border-r border-gray-200/60">
                <span className="font-extrabold text-xl text-gray-800">
                  {userData?.followingCount ?? 0}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
                  Following
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-sm text-gray-800">
                  {getBirthDateWithAge(userData?.dateOfBirth)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
                  Birthday
                </span>
              </div>
            </div>

            {/* Action Buttons Container */}
            <div className="mt-6 flex flex-wrap sm:flex-nowrap gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer">
                Connect
              </button>
              <button className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer">
                Message
              </button>
              <button
                onClick={() => navigate("/changePassword")}
                className="bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-sky-500/10 transition-all cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* User Posts Stream */}
        <div className="mt-8 space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              لا توجد منشورات لعرضها حالياً.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
