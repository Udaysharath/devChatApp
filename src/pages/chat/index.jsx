import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyChatContainer from "./components/empty-chat-container";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType ?? ""
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData ?? ""
  );
  const isUploading = useSelector((state) => state.chatSlice.isUploading);
  const isDownloading = useSelector((state) => state.chatSlice.isDownloading);
  const fileUploadProgress = useSelector(
    (state) => state.chatSlice.fileUploadProgress
  );
  const fileDownloadProgress = useSelector(
    (state) => state.chatSlice.fileDownloadProgress
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <>
      <div className="h-[100vh] flex text-white overflow-hidden">
        {isUploading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex justify-center items-center gap-5 flex-col backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
            {fileUploadProgress}%
          </div>
        )}
        {isDownloading && (
          <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex justify-center items-center gap-5 flex-col backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">Downloading File</h5>
            {fileDownloadProgress}%
          </div>
        )}
        <ContactsContainer />
        {!selectedChatType ? <EmptyChatContainer /> : <ChatContainer />}
      </div>
    </>
  );
};

export default Chat;
