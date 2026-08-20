import React, { useContext, useEffect, useState } from "react";
import Login from "../../Auth/Login/Login";
import Profile from "../Profile/Profile";
import Navbar from "../Navbar/Navbar";
import { CounterContext } from "../../Contexts/CounterContext";
import axios from "axios";
import PostCard from "../PostCard/PostCard";
import RingLoader from "./../../../node_modules/react-spinners/esm/RingLoader";
import { useQuery } from "@tanstack/react-query";
import CreatePostCard from "../CreatePostCard/CreatePostCard";

export default function Home() {
  // const [allPosts, setAllPosts] = useState(null);
  // const [error, setError] = useState(null);
  // const [iserror, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // function GetPosts() {
  //   return axios.get("https://route-posts.routemisr.com/posts", {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //     params: {
  //       sort: "createdAt",
  //     },
  //   });
  // }

  function getPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      params: {
        sort: "-createdAt",
      },
    });
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getPosts,
    retry: 2,
    // retryDelay:2000
    // staleTime: 10000,
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // refetchInterval: 3000,
    select: (data) => {
      return data?.data.data.posts;
    },
    // enabled: false,
  });
  // const posts = data?.data.data.posts;

  console.log(data);

  // const { data, isLoading, isError, error, isFetching, isFetched, refetch } =
  //   useQuery({
  //     queryKey: ["getPosts"],
  //     queryFn: GetPosts,
  //     retry: 3,
  //     // enabled: false,
  //   });

  // const posts = data?.data.data.posts;

  //     .then((response) => {
  //       console.log(response.data.data.posts);
  //       setAllPosts(response.data.data.posts);
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data.message);
  //       setError(error.response.data.message);
  //       setIsError(true);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }

  // useEffect(() => {
  //   // call api
  //   GetPosts();
  // }, []);

  if (isLoading) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <RingLoader color="blue" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <h2>{error?.message || "حدث خطأ غير متوقع"}</h2>
      </div>
    );
  }
  return (
    <>
      {/* <button
        onClick={refetch}
        className=" bg-sky-400 text-white py-2 px-3 rounded-2xl ms-10 cursor-pointer"
      >
        GetPosts
      </button> */}
      {/* <h2 className="ms-10 text-2xl font-bold">isLoading :{isLoading + " "}</h2>
      <h2 className="ms-10 text-2xl font-bold">isError :{isError + " "}</h2>
      <h2 className="ms-10 text-2xl font-bold">
        isFetching :{isFetching + " "}
      </h2>
      <h2 className="ms-10 text-2xl font-bold">isFetched :{isFetched + " "}</h2> */}

      {/* {posts?.map((post) => {
        return <PostCard key={post._id} post={post} isSinglePost={false} />;
      })} */}
      <CreatePostCard />

      {data?.map((post) => {
        return <PostCard key={post._id} post={post} isSinglePost={false} />;
      })}
    </>
  );
}
