import React, { useEffect } from "react";
import ProfileInfo from "./components/profile-info/";
import NewDm from "./components/new-dm";
import { apiClient } from "@/lib/api-client";
import { GET_CHANNELS, GET_CONTACTS_LIST } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setChannels,
  setDirectMessagesContacts,
} from "@/store/reducers/chatSlice";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
  const dispatch = useDispatch();
  const directMessagesContacts = useSelector(
    (state) => state.chatSlice.directMessagesContacts ?? []
  );
  const channels = useSelector((state) => state.chatSlice.channels ?? []);
  const getContacts = async () => {
    try {
      const response = await apiClient.get(GET_CONTACTS_LIST, {
        withCredentials: true,
      });
      if (response && response.status === 200) {
        // console.log("response.data.contacts", response.data.contacts);
        dispatch(setDirectMessagesContacts(response.data.contacts));
      }
    } catch (error) {}
  };
  const getChannels = async () => {
    try {
      const response = await apiClient.get(GET_CHANNELS, {
        withCredentials: true,
      });
      if (response && response.status === 200) {
        dispatch(setChannels(response.data.channels));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <span>Chat App</span>
      </div>
      <div className="my-5">
        <div className="pr-10 flex justify-between items-center">
          <Title text={"Direct Messages"} />
          <NewDm />
        </div>
        <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="pr-10 flex justify-between items-center">
          <Title text={"Channels"} />
          <CreateChannel />
        </div>
        <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className=" uppercase tracking-widest text-neutral-400 pl-10 font-light text-orange-90 text-sm">
      {text}
    </h6>
  );
};
