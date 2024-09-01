import {
  setSelectedChatData,
  setSelectedChatMessages,
  setSelectedChatType,
} from "@/store/reducers/chatSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
  const dispatch = useDispatch();
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData
  );
  const directMessagesContacts = useSelector(
    (state) => state.chatSlice.directMessagesContacts ?? []
  );
  const [selectedColor, setSelectedColor] = useState("#a223a0");
  const handleClickContact = (contact) => {
    if (isChannel) {
      dispatch(setSelectedChatType("channel"));
    } else {
      dispatch(setSelectedChatType("contact"));
      dispatch(setSelectedChatData(contact));
    }
    if (selectedChatData && selectedChatData._id !== contact._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClickContact(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className=" object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? ""
                        : "border-[1px]"
                    }uppercase h-10 w-10 flex items-center justify-center rounded-full`}
                    style={{
                      backgroundColor:
                        selectedChatData && selectedChatData._id === contact._id
                          ? "#ffffff22"
                          : selectedColor,
                      color: "#fff",
                    }}
                  >
                    {contact?.firstName
                      ? contact?.firstName.split("").shift()
                      : contact?.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex justify-center items-center rounded-full"></div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : contact.firstName && contact.lastName ? (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            ) : (
              <span>{contact.email}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
