import React, { useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext.jsx";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE } from "@/utils/constants";
import {
  setFileUploadProgress,
  setIsUploading,
} from "@/store/reducers/chatSlice";

const MessageBar = () => {
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType ?? ""
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData ?? ""
  );
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const socket = useSocket();
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      console.log("file", file);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(setIsUploading(true));
        const response = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            dispatch(
              setFileUploadProgress(Math.round(100 * data.loaded) / data.total)
            );
          },
        });

        if (response && response.status === 200) {
          dispatch(setIsUploading(false));
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      dispatch(setIsUploading(false));
    } finally {
      dispatch(setIsUploading(false));
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2d33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="type your message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        {/* <div className="relative">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiEmojiStickerLine className="text-2xl" />
          </button>
        </div> */}
        <div className="absolute bottom-16 right-0"></div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 gap-0 focus:border-none focus:outline-none hover:bg-[#741bda] focus:bg-[#741bda] focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
        disabled={message ? false : true}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
