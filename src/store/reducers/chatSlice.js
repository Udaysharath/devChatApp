import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChatType: "",
  selectedChatData: "",
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData: (state, action) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },
    addChatMessage: (state, action) => {
      state.selectedChatMessages = [
        ...state.selectedChatMessages,
        action.payload,
      ];
    },
    setDirectMessagesContacts: (state, action) => {
      state.directMessagesContacts = action.payload;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setFileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addChannel: (state, action) => {
      state.channels = [...state.channels, action.payload];
    },
    addChannelsInChannelList: (state, action) => {
      const message = action.payload;
      const data = state.channels.find(
        (channel) => channel._id === message.channelId
      );
      const index = state.channels.findIndex(
        (channel) => channel._id === message.channelId
      );
      if (index !== -1 && index !== undefined) {
        state.channels.splice(index, 1);
        state.channels.unshift(data);
      }
    },
    addContactsInDmContacts: (state, action) => {
      const { message, userInfo } = action.payload;
      const fromId =
        message.sender._id === userInfo.id
          ? message.recipient._id
          : message.sender._id;
      const fromData =
        message.sender._id === userInfo.id ? message.recipient : message.sender;
      const dmContacts = [...state.directMessagesContacts];
      const data = dmContacts.find((contact) => contact._id === fromId);
      const index = dmContacts.findIndex((contact) => contact._id === fromId);
      if (index !== -1 && index !== undefined) {
        dmContacts.splice(index, 1);
        dmContacts.unshift(data);
      } else {
        dmContacts.unshift(fromData);
      }
      state.directMessagesContacts = dmContacts;
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  addChatMessage,
  setDirectMessagesContacts,
  setIsUploading,
  setIsDownloading,
  setFileUploadProgress,
  setFileDownloadProgress,
  setChannels,
  addChannel,
  addChannelsInChannelList,
  addContactsInDmContacts,
} = chatSlice.actions;
export default chatSlice.reducer;
