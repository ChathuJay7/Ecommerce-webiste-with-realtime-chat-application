import React, { useEffect, useState } from "react";
import CreateNewChatPopUp from "./CreateNewChatPopUp";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUserThreads } from "../../API/Chat/ChatAPI";
import { displayGreetingMsg } from "../../utils/Utilities";

export default function ChatSideBar(props: { children: any }) {
  const [createNewChatPopUp, setCreateNewChatPopUp] = useState(false);
  const [greetingMsg, setGreetingMsg] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [threads, setThreads] = useState<string[]>([]);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    setGreetingMsg(displayGreetingMsg());
  }, []);

  return (
    <React.Fragment>
      <div className="min-w-fit w-1/4 h-full overflow-y-scroll bg-gray-200 flex flex-col justify-start items-center overflow-x-hidden pt-10 pb-5 px-2">
        <div className="flex flex-col justify-start self-start">
          <h1 className="text-left font-bold text-gray-800 text-2xl ml-5">
            Welcome {user && user.firstName}
          </h1>
          <p className="text-sm ml-5">{greetingMsg}</p>
        </div>
        <button
          onClick={() => setCreateNewChatPopUp(true)}
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-xl inline-flex items-center w-11/12 mx-5 mt-5 mb-8"
        >
          <svg
            className="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
          <span>Start new chat</span>
        </button>
        <div className="flex flex-row justify-start items-start self-start">
          <h1 className="text-left font-bold text-gray-800 text-2xl mb-2 ml-5">
            All Chats
          </h1>
        </div>
        {props.children}
      </div>
      {createNewChatPopUp && (
        <CreateNewChatPopUp
          isOpen={setCreateNewChatPopUp}
        />
      )}
    </React.Fragment>
  );
}
