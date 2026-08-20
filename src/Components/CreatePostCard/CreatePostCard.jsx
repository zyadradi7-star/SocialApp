import { Avatar, Input, TextArea } from "@heroui/react";
import React, { useContext, useRef, useState } from "react";
import { Button, Modal } from "@heroui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AuthContext } from "../../Contexts/AuthContext";
export default function CreatePostCard() {
  const query = useQueryClient();
  const [upLoadedImg, setupLoadedImg] = useState(null);
  const image = useRef(null);
  const body = useRef(null);
  const { userData } = useContext(AuthContext);
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

  function createPostFN() {
    return axios.post(
      "https://route-posts.routemisr.com/posts",
      prepareFormData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  const { data, isPending, isError, error, mutate } = useMutation({
    mutationFn: createPostFN,
    onSuccess: (res) => {
      query.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success(res?.data?.message);
      setupLoadedImg(null);
      if (body.current) body.current.value = "";
      if (image.current) image.current.value = "";
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });
  console.log(data?.data.message);

  return (
    <div className="bg-gray-100 p-4 rounded shadow w-1/2 mx-auto mb-5 mt-4">
      <div className="flex gap-4 p-2 items-center">
        <Avatar>
          <Avatar.Image alt={userData.name} src={userData.photo} />
        </Avatar>
        <Modal>
          <Modal.Trigger className=" w-full flex-1">
            <Button
              className=" w-full justify-start text-gray-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-full px-4 py-2 focus:outline-none"
              variant="flat"
            >
              What is on your Mind ...?
            </Button>
          </Modal.Trigger>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Create Post</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <div className="flex gap-2 items-end">
                    <TextArea
                      ref={body}
                      aria-label="Quick project update"
                      className="h-32 w-96"
                      placeholder="What is on your Mind ...?"
                    />
                    <label htmlFor="img">
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
                        id="img"
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
                    isDisabled={isPending}
                    onClick={mutate}
                    className="w-full"
                    slot="close"
                  >
                    {isPending ? (
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
                      "CreatePost"
                    )}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </div>
  );
}
