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
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedChatData,
  setSelectedChatType,
} from "@/store/reducers/chatSlice";

const NewDm = () => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType ?? ""
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData ?? ""
  );
  const dispatch = useDispatch();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#a223a0");
  //   const debounce = useDeb
  const searchContacts = async (event) => {
    try {
      if (event.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { event },
          { withCredentials: true }
        );
        if (response.data.contacts && response.status === 200) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {}
  };

  const handleOpen = () => {
    setOpenNewContactModal(true);
    setSearchedContacts([]);
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false),
      dispatch(setSelectedChatType("contact")),
      dispatch(setSelectedChatData(contact)),
      setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={handleOpen}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                searchContacts(e.target.value);
              }}
            />
          </div>
          {searchedContacts && searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    className="flex gap-3 items-center justify-start cursor-pointer"
                    key={contact._id}
                    onClick={() => {
                      selectNewContact(contact);
                    }}
                  >
                    {contact._id !== userInfo?.id && (
                      <div className="w-12 h-12 relative">
                        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              alt="profile"
                              className=" object-cover w-full h-full bg-black rounded-full"
                            />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12 border-[1px] flex items-center justify-center rounded-full`}
                              style={{
                                backgroundColor: selectedColor,
                                color: "#fff",
                              }}
                            >
                              {contact?.firstName
                                ? contact?.firstName.split("").shift()
                                : contact?.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                    )}
                    {contact._id !== userInfo?.id && (
                      <div className="flex flex-col">
                        <span>
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts && searchedContacts.length <= 0 && (
            <div className="flex-1 md:flex flex-col items-center justify-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className=" text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>
                  Search new <span className=" text-purple-500">Contact</span>
                  <span className="">.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
