import React, { useRef, useState } from "react";
import { Button, Dropdown, Input, Label, TextArea } from "@heroui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Modal } from "@heroui/react";
import Swal from "sweetalert2";

export default function DropDownPost({ postId }) {
  const [isOpen, setIsOpen] = useState(false);
  const query = useQueryClient();
  //^ Delete post
  function deletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  const {
    data: deleteData,
    mutate: handleDelPost,
    error: deleteErr,
  } = useMutation({
    mutationFn: deletePost,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] });
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      toast.error("post Not Deleted successfully");
    },
  });
  //^ هنا بنستخدم الـ onAction للتحقق من المفتاح وتنفيذ الحذف
  const confirmDelete = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من استعادة هذا المنشور بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-4 py-2",
        cancelButton: "rounded-xl px-4 py-2",
      },
    }).then((result) => {
      if (result?.isConfirmed) {
        handleDelPost();
      }
    });
  };

  const handleDelAction = (key) => {
    if (key === "delete-file") {
      confirmDelete(); //^ استدعاء التنبيه بدلاً من الحذف المباشر
    }

    if (key === "edit-file") {
      setIsOpen(true);
    }
  };

  console.log(deleteData?.data.message);

  // ^ update POSt
  const [upLoadedImg, setupLoadedImg] = useState(null);
  const image = useRef(null);
  const body = useRef(null);
  function handleImagePreview(e) {
    const imgSrc = URL.createObjectURL(e.target.files[0]);
    setupLoadedImg(imgSrc);
    console.log(imgSrc);
  }

  function handleCloseImg() {
    setupLoadedImg(null);
    image.current.value = null;
  }

  function prepareFormData() {
    const formData = new FormData();
    if (body.current.value) {
      formData.append("body", body.current.value);
    }

    if (image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    return formData;
  }

  // call Api

  function updatePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      prepareFormData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  const {
    data: updateData,
    mutate: handleUpdatePost,
    isPending: updatePending,
  } = useMutation({
    mutationFn: updatePost,
    onSuccess: (res) => {
      console.log("Post Updated successfully");
      toast.success(res?.data.message);
      query.invalidateQueries({ queryKey: ["getPosts"] });
      query.invalidateQueries({ queryKey: ["getUserPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost", postId] });

      setupLoadedImg(null);
      if (body.current) body.current.value = "";
      if (image.current) image.current.value = "";
    },

    onError: () => {
      toast.error("Post Not Updated successfully");
    },
  });

  console.log(updateData?.data.message);
  return (
    <>
      <Dropdown>
        <Button aria-label="Menu" variant="secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={handleDelAction}>
            <Dropdown.Item id="edit-file" textValue="Edit file">
              <Label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Label>
              <Label>Edit Post</Label>
            </Dropdown.Item>
            <Dropdown.Item
              key="delete-file"
              id="delete-file"
              textValue="Delete file"
              variant="danger"
            >
              <Label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </Label>
              <Label>Delete Post</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-90">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Update Post</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="flex gap-2 items-end">
                  <TextArea
                    ref={body}
                    aria-label="Quick project update"
                    className="h-32 w-96"
                    placeholder="What is on your Mind ...?"
                  />
                  <label htmlFor={postId}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                    <Input
                      ref={image}
                      onChange={handleImagePreview}
                      id={postId}
                      type="file"
                      hidden
                    />
                  </label>
                </div>

                {upLoadedImg && (
                  <div className="relative mt-4">
                    <img src={upLoadedImg} className="w-full" alt="" />

                    <svg
                      onClick={handleCloseImg}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 absolute top-0 right-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={handleUpdatePost}
                  className="w-full"
                  slot="close"
                >
                  {updatePending ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 animate-spin"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  ) : (
                    "update Post"
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
