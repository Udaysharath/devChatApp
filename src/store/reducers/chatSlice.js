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
} = chatSlice.actions;
export default chatSlice.reducer;
