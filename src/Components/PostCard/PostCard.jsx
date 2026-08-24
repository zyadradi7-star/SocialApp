import React, { useContext, useState } from "react";
import CommentCard from "../CommentCard/CommentCard";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateCommentCard from "../CreateCommentCard/CreateCommentCard";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import DropDownPost from "../DropDownPost/DropDownPost";
import { AuthContext } from "../../Contexts/AuthContext";

export default function PostCard({ post, isSinglePost = false }) {
  if (!post) return null;
  const query = useQueryClient();
  const { userData } = useContext(AuthContext);
  const [showCommentInput, setShowCommentInput] = useState(false);

  function formatPostTime(dateString) {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: enUS,
      });
    } catch {
      return dateString;
    }
  }

  function getPostComment() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${post.id}/comments`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          sort: "-createdAt",
          limit: 10,
        },
      },
    );
  }

  const { data } = useQuery({
    queryKey: ["getPostComments", post.id],
    queryFn: getPostComment,
    enabled: isSinglePost,
  });

  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post.id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  const { data: likeData, mutate: handleLikePost } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", post.id] });
    },
  });

  const isLiked = likeData?.data.data.liked;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 w-full max-w-2xl mx-auto my-6 overflow-hidden transition-all duration-200">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Link
          to={`/postDetails/${post.id}`}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <img
            src={post?.user.photo}
            alt={post?.user.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:opacity-90 transition-opacity"
          />
          <div>
            <p className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {post?.user.name}
            </p>
            <span className="text-xs text-gray-400">
              {formatPostTime(post?.createdAt)}
            </span>
          </div>
        </Link>

        {userData?._id === post?.user?._id && (
          <div className="relative">
            <DropDownPost postId={post?.id} />
          </div>
        )}
      </header>

      {/* Body */}
      {post?.body && (
        <p className="px-4 pb-3 text-gray-800 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {post?.body}
        </p>
      )}

      {/* Image */}
      {post?.image && (
        <div className="w-full bg-gray-50 border-y border-gray-100 overflow-hidden">
          <img
            src={post?.image}
            alt="Post content"
            className="max-h-120 w-full object-cover"
          />
        </div>
      )}

      {/* Action Stats & Bar */}
      <div className="px-4 pt-3 pb-2">
        {/* Post Actions Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-gray-600 text-sm font-medium">
          {/* Like Button */}
          <button
            onClick={handleLikePost}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer ${
              isLiked ? "text-blue-600 font-semibold" : "hover:text-gray-900"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>
            <span>{post?.likesCount > 0 ? post?.likesCount : ""} Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowCommentInput((prev) => !prev)}
            className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 active:scale-95 transition-all hover:text-blue-600 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
            <span>
              {post?.commentsCount > 0 ? post?.commentsCount : ""} Comment
            </span>
          </button>

          {/* Share Button */}
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-50 active:scale-95 transition-all hover:text-blue-600 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
            <span>{post?.sharesCount > 0 ? post?.sharesCount : ""} Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 space-y-3">
        {showCommentInput && (
          <CreateCommentCard
            postId={post.id}
            queryKey={
              isSinglePost ? ["getPostComments", post.id] : ["getPosts"]
            }
          />
        )}

        {/* Top Comment in Feed View */}
        {!isSinglePost && post?.topComment && (
          <CommentCard comment={post?.topComment} postId={post?.id} />
        )}

        {/* All Comments in Single Post View */}
        {isSinglePost &&
          data?.data?.data?.comments?.map((comment) => (
            <CommentCard
              key={comment?._id}
              comment={comment}
              postId={post?.id}
            />
          ))}
      </div>
    </div>
  );
}
