import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import {
  GET_ALL_CONTACTS,
  HOST,
  SEARCH_CONTACTS_ROUTE,
} from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedChatData,
  setSelectedChatType,
} from "@/store/reducers/chatSlice";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType ?? ""
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData ?? ""
  );
  const dispatch = useDispatch();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#a223a0");
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  //   const debounce = useDeb

  const getAllContacts = async () => {
    const response = await apiClient.get(GET_ALL_CONTACTS, {
      withCredentials: true,
    });
    setAllContacts(response.data.contacts);
  };

  const createChannel = async () => {};
  useEffect(() => {
    getAllContacts();
  }, []);
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => {
                setNewChannelModal(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for New channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                setChannelName(e.target.value);
              }}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className=" rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search contacts"
              value={searchedContacts}
              onChange={setSearchedContacts}
              emptyIndicator={
                <p className="text-lg text-center leading-10 text-gray-600">
                  No results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
