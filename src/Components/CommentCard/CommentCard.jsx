// import React, { useContext, useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import { enUS } from "date-fns/locale";
// import axios from "axios";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import { AuthContext } from "../../Contexts/AuthContext";

// export default function CommentCard({ comment, postId }) {
//   console.log("Comment", comment);
//   console.log("postId", postId);
//   const query = useQueryClient();
//   const { userData } = useContext(AuthContext);
//   const [isEditing, setIsEditing] = useState(false);
//   const isMyComment = userData?._id === comment?.commentCreator?._id;
//   const { register, handleSubmit, reset } = useForm({
//     defaultValues: { content: comment?.content || "" },
//   });

//   // ^ Delete Comment API
//   function deleteCommentFN() {
//     return axios.delete(
//       `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       },
//     );
//   }
//   const {
//     data: delComData,
//     isPending: delComPending,
//     mutate: handleDelComment,
//   } = useMutation({
//     mutationFn: deleteCommentFN,
//     onSuccess: (res) => {
//       toast.success(res?.data?.message);
//       query.invalidateQueries({ queryKey: ["getPosts"] });
//       query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
//       query.invalidateQueries({ queryKey: ["getPostComments", postId] });
//       query.invalidateQueries({ queryKey: ["getUserPosts"] });
//     },

//     onError: () => {
//       toast.error("Comment Not Deleted successfully");
//     },
//   });

//   // ^ update comment API
//   const formData = new FormData();

//   function updateCommentFN(data) {
//     const formData = new FormData();

//     // إرسال النص فقط إذا تم إدخاله
//     if (data.content) {
//       formData.append("content", data.content);
//     }

//     // التأكد من اختيار ملف صورة وإلحاقه
//     if (data.image && data.image.length > 0) {
//       formData.append("image", data.image[0]);
//     }

//     return axios.put(
//       `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       },
//     );
//   }

//   const {
//     data: updateData,
//     isPending: updateComPending,
//     mutate: handleUpdateComment,
//   } = useMutation({
//     mutationFn: updateCommentFN,
//     onSuccess: async (res) => {
//       toast.success(res?.data?.message);
//       setIsEditing(false);

//       // إجبار إعادة جلب البيانات فوراً لضمان تحديث الواجهة
//       await Promise.all([
//         query.invalidateQueries({ queryKey: ["getPosts"] }),
//         query.invalidateQueries({ queryKey: ["getSinglePost", postId] }),
//         query.invalidateQueries({ queryKey: ["getPostComments", postId] }),
//         query.invalidateQueries({ queryKey: ["getUserPosts"] }),
//       ]);
//     },
//     onError: (err) => {
//       toast.error("Failed to update comment");
//     },
//   });

//   const handleSubmitUpdate = (data) => {
//     handleUpdateComment(data);
//   };

//   function formatPostTime(dateString) {
//     if (!dateString) return "";
//     try {
//       return formatDistanceToNow(new Date(dateString), {
//         addSuffix: true, // يضيف كلمة "ago"
//         locale: enUS, //  استخدام الإنجليزية
//       });
//     } catch {
//       return dateString;
//     }
//   }
//   return (
//     <div className="border border-gray-500 p-4 mt-4">
//       <header className="flex justify-between items-center">
//         <div className="flex items-center space-x-3 mb-3">
//           <img
//             src={comment?.commentCreator?.photo}
//             alt={comment?.commentCreator?.name}
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <p className="font-semibold">{comment?.commentCreator?.name}</p>
//             <p className="text-xs text-gray-500">
//               {formatPostTime(comment?.createdAt)}
//             </p>
//           </div>
//         </div>

//         {isMyComment && (
//           <div className="flex gap-4">
//             <button onClick={() => setIsEditing(!isEditing)}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="size-6 cursor-pointer text-blue-600"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
//                 />
//               </svg>
//             </button>
//             <button onClick={handleDelComment} disabled={delComPending}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="size-6 cursor-pointer text-red-600"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                 />
//               </svg>
//             </button>
//           </div>
//         )}
//       </header>

//       {isEditing ? (
//         <form onSubmit={handleSubmit(handleSubmitUpdate)}>
//           <div className="flex items-center mt-1 gap-3">
//             <input
//               {...register("content")}
//               type="text"
//               className="w-full h-10 px-3 text-sm text-gray-700 border border-r-0 rounded-r-none border-blue-500 focus:outline-none rounded shadow-sm"
//               placeholder="Enter your Comment"
//             />
//             <button
//               type="submit"
//               disabled={updateComPending}
//               className="h-10 px-4 text-sm bg-blue-500 border border-l-0 border-blue-500 rounded-r shadow-sm text-blue-50 hover:text-white hover:bg-blue-400 hover:border-blue-400 focus:outline-none"
//             >
//               {updateComPending ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="size-6 animate-spin"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
//                   />
//                 </svg>
//               ) : (
//                 "update"
//               )}
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="flex gap-4 items-center">
//           {comment?.image && (
//             <img
//               src={comment.image}
//               alt="Comment attachment"
//               className="w-10 h-10 rounded-full object-cover"
//             />
//           )}
//           <p className="mb-3">{comment?.content}</p>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useContext, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Contexts/AuthContext";

export default function CommentCard({ comment, postId }) {
  const query = useQueryClient();
  const { userData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const isMyComment = userData?._id === comment?.commentCreator?._id;

  const { register, handleSubmit } = useForm({
    defaultValues: { content: comment?.content || "" },
  });

  // Delete Comment API
  function deleteCommentFN() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  const { isPending: delComPending, mutate: handleDelComment } = useMutation({
    mutationFn: deleteCommentFN,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Comment deleted");
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
      query.invalidateQueries({ queryKey: ["getPostComments", postId] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] });
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  // Update Comment API
  function updateCommentFN(data) {
    const formData = new FormData();
    if (data.content) formData.append("content", data.content);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  const { isPending: updateComPending, mutate: handleUpdateComment } =
    useMutation({
      mutationFn: updateCommentFN,
      onSuccess: async (res) => {
        toast.success(res?.data?.message || "Comment updated");
        setIsEditing(false);
        await Promise.all([
          query.invalidateQueries({ queryKey: ["getPosts"] }),
          query.invalidateQueries({ queryKey: ["getSinglePost", postId] }),
          query.invalidateQueries({ queryKey: ["getPostComments", postId] }),
          query.invalidateQueries({ queryKey: ["getUserPosts"] }),
        ]);
      },
      onError: () => {
        toast.error("Failed to update comment");
      },
    });

  const handleSubmitUpdate = (data) => {
    handleUpdateComment(data);
  };

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

  return (
    <div className="bg-gray-50/70 hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-3 transition-all duration-200 shadow-xs">
      <header className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <img
            src={
              comment?.commentCreator?.photo || "https://via.placeholder.com/40"
            }
            alt={comment?.commentCreator?.name || "User Avatar"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/60"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
              {comment?.commentCreator?.name}
            </h4>
            <span className="text-[11px] font-medium text-gray-400">
              {formatPostTime(comment?.createdAt)}
            </span>
          </div>
        </div>

        {isMyComment && (
          <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              title="Edit comment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>

            <button
              onClick={handleDelComment}
              disabled={delComPending}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Delete comment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        )}
      </header>

      {/* Edit Mode vs Display Mode */}
      {isEditing ? (
        <form onSubmit={handleSubmit(handleSubmitUpdate)} className="mt-3">
          <div className="flex gap-2">
            <input
              {...register("content")}
              type="text"
              className="flex-1 px-3.5 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="Edit your comment..."
              autoFocus
            />
            <button
              type="submit"
              disabled={updateComPending}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center min-w-16"
            >
              {updateComPending ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 animate-spin"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-2 space-y-2">
          {comment?.content && (
            <p className="text-sm text-gray-700 leading-relaxed pl-1">
              {comment.content}
            </p>
          )}
          {comment?.image && (
            <div className="pt-1">
              <img
                src={comment.image}
                alt="Comment attachment"
                className="max-h-52 w-auto rounded-xl object-cover border border-gray-100 shadow-xs"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
