import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/store/reducers/chatSlice";
import { HOST } from "@/utils/constants";
import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const ChatHeader = () => {
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType ?? ""
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData ?? ""
  );
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState("#a223a0");
  const handleCloseChat = () => {
    dispatch(setSelectedChatType(""));
    dispatch(setSelectedChatData(""));
    dispatch(setSelectedChatMessages([]));
  };
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 w-full">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative flex justify-center items-center">
            {selectedChatType === "contact" ? (
              <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className=" object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 border-[1px] flex items-center justify-center rounded-full`}
                    style={{
                      backgroundColor: selectedColor,
                      color: "#fff",
                    }}
                  >
                    {selectedChatData?.firstName
                      ? selectedChatData?.firstName.split("").shift()
                      : selectedChatData?.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex justify-center items-center rounded-full">
                #
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {selectedChatType == "channel" && (
              <span>{selectedChatData.name}</span>
            )}
            {selectedChatType === "contact" && (
              <>
                <span>
                  {selectedChatData.firstName && selectedChatData.lastName
                    ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                    : selectedChatData.email}
                </span>

                <span className="text-xs">{selectedChatData.email}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleCloseChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
