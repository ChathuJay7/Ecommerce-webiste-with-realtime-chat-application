import React, { useState } from "react";
import CreateNewSingleChat from "./CreateNewSingleChat";
import CreateNewGroupChat from "./CreateNewGroupChat";

export default function CreateNewChatPopUp(props: { isOpen: any }) {
  const [createChatMainPopUp, setCreateChatMainPopUp] = useState(true);
  const [createNewSingleChat, setCreateNewSingleChat] = useState(false);
  const [createNewGroupChat, setCreateNewGroupChat] = useState(false);

  const createSingleChat = () => {
    setCreateChatMainPopUp(false);
    setCreateNewSingleChat(true);
  };

  const createGroupChat = () => {
    setCreateChatMainPopUp(false);
    setCreateNewGroupChat(true);
  };

  return (
    <React.Fragment>
      <div className="absolute top-0 left-0 bg-slate-800 bg-opacity-75 w-full h-full z-50 flex justify-center items-center">
        {createChatMainPopUp && (
          <div className="w-96 h-auto p-12 rounded-lg bg-slate-100 text-slate-900">
            <h1 className="text-3xl font-bold">Create a new chat</h1>
            <h5 className="text-slate-400">Select the chat type</h5>
            <div className="flex flex-row justify-around items-center mt-4">
              <button
                onClick={createSingleChat}
                className="flex flex-col justify-center items-center w-32 h-48 bg-emerald-500 hover:bg-emerald-600 cursor-pointer rounded-lg text-slate-100 font-bold px-2"
              >
                <i className="fa-solid fa-user text-5xl mb-4"></i>
                Single Chat
              </button>
              <button
                onClick={createGroupChat}
                className="flex flex-col justify-center items-center w-32 h-48 bg-emerald-500 hover:bg-emerald-600 cursor-pointer rounded-lg text-slate-100 font-bold px-2"
              >
                <i className="fa-solid fa-users text-5xl mb-4"></i>
                Group Chat
              </button>
            </div>
            <div className="flex flex-row justify-end items-center">
              <button
                onClick={() => props.isOpen(false)}
                className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded mt-5"
              >
                close
              </button>
            </div>
          </div>
        )}
      </div>
      {createNewSingleChat && <CreateNewSingleChat isOpen={props.isOpen} />}
      {createNewGroupChat && <CreateNewGroupChat isOpen={props.isOpen} />}
    </React.Fragment>
  );
}
