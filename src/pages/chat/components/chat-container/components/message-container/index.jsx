import { apiClient } from "@/lib/api-client";
import {
  setFileDownloadProgress,
  setIsDownloading,
  setSelectedChatMessages,
} from "@/store/reducers/chatSlice";
import { GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData
  );
  const selectedChatMessages = useSelector(
    (state) => state.chatSlice.selectedChatMessages ?? []
  );
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response && response.status === 200) {
          console.log("response.data", response.data);
          dispatch(setSelectedChatMessages(response.data.messages));
        }
      } catch (error) {}
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bnp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    dispatch(setIsDownloading(true));
    dispatch(setFileDownloadProgress(0));
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "Blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        const percentCompleted = Math.round(loaded * 100) / total;
        dispatch(setFileDownloadProgress(percentCompleted));
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    dispatch(setIsDownloading(false));
    dispatch(setFileDownloadProgress(0));
  };
  const renderMessages = () => {
    let lastDate = null;
    return (
      selectedChatMessages &&
      selectedChatMessages.length > 0 &&
      selectedChatMessages.map((message, index) => {
        const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
        const showDate = messageDate != lastDate;
        lastDate = messageDate;
        return (
          <div key={index}>
            {showDate && (
              <div className="text-center text-gray-500 my-2">
                {moment(message.timeStamp).format("LL")}
              </div>
            )}
            {selectedChatType === "contact" && renderDMMessages(message)}
          </div>
        );
      })
    );
  };
  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-[#fff]/80 border-[#fff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-[#fff]/80 border-[#fff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className=" cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-5">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timeStamp).format("LT")}
        </div>
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {Boolean(showImage) && (
        <>
          <div className="fixed z-[100] top-0 left-0 h-[100vh] w-[100vw] flex justify-center items-center backdrop-blur-lg flex-col">
            <div>
              <img
                src={`${HOST}/${imageUrl}`}
                className="h-[80vh] w-full bg-cover"
              />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  downloadFile(imageUrl);
                }}
              >
                <IoMdArrowRoundDown />
              </span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setShowImage(false);
                  setImageUrl(null);
                }}
              >
                <IoCloseSharp />
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
