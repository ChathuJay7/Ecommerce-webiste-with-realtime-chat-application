import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  id: string;
  members: { id: string, username: string }[];
  isGroupChat: boolean;
  threadName?: string
  isOpen: boolean
}

const initialState: ChatState = {
  id: "",
  members: [],
  isGroupChat: false,
  threadName: "",
  isOpen: false
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedThread: (state, action) => {
      state.id = action.payload.id;
      state.members = action.payload.members;
      state.isGroupChat = action.payload.isGroupChat;
      state.threadName = action.payload.threadName;
      state.isOpen= true;
    },
    resetChat: (state) => {
      state.id = initialState.id;
      state.members = initialState.members;
      state.isGroupChat = initialState.isGroupChat;
      state.threadName = initialState.threadName;
      state.isOpen = initialState.isOpen;
    },
  },
});

export default chatSlice.reducer;
export const { setSelectedThread, resetChat } = chatSlice.actions;