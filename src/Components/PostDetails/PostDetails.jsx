import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import { RingLoader } from "react-spinners";
export default function PostDetails() {
  const { id } = useParams();

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {},
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getSinglePost,
    staleTime: 0,
  });
  console.log(data?.data.data.post);

  if (isLoading) {
    return (
      <>
        <h2>wELOSF</h2>
        <div className=" h-screen flex justify-center items-center">
          <RingLoader />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <h2>{error?.message || "حدث خطأ غير متوقع"}</h2>
      </div>
    );
  }
  return <>{<PostCard post={data?.data.data.post} isSinglePost={true} />}</>;
}
