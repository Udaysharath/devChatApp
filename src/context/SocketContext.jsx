import {
  addChannelsInChannelList,
  addChatMessage,
  addContactsInDmContacts,
  setSelectedChatMessages,
} from "@/store/reducers/chatSlice";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const selectedChatType = useSelector(
    (state) => state.chatSlice.selectedChatType
  );
  const selectedChatData = useSelector(
    (state) => state.chatSlice.selectedChatData
  );
  const selectedChatMessages = useSelector(
    (state) => state.chatSlice.selectedChatMessages
  );

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("connected to server");
      });

      const handleReceiveMessage = async (message) => {
        // console.log("message", message);
        if (message) {
          dispatch(
            addChatMessage({
              ...message,
              recipient: message.recipient._id,
              sender: message.sender._id,
            })
          );
          dispatch(addContactsInDmContacts({ message, userInfo }));
        }
      };

      const handleReceiveChannelMessage = (message) => {
        if (message) {
          dispatch(
            addChatMessage({
              ...message,
              recipient: message.recipient,
              sender: message.sender,
            })
          );
          dispatch(addChannelsInChannelList(message));
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
