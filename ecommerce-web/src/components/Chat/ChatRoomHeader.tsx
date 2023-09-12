import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import ChatRoomMembers from "./ChatRoomMembers";

export default function ChatRoomHeader(props: {
  userName: any;
  profilePic: any;
  socket: any;
}) {
  const [isShowTyping, setIsShowTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const { isGroupChat } = useAppSelector((state) => state.chat);
  const [isOpenChatInfo, setIsOpenChatInfo] = useState(false);

  useEffect(() => {
    props.socket.on("userTyping", (data: any) => {
      if (user.firstName === data.username) {
        setIsShowTyping(false);
      } else {
        setIsShowTyping(true);
        setTypingUser(data.username);
        setTimeout(() => {
          setIsShowTyping(false);
        }, 1000);
      }
    });
  }, []);

  const handleOpenChatInfo = () => {
    setIsOpenChatInfo(true);
  }

  return (
    <React.Fragment>
      <div className="top-5 sticky bg-slate-200 w-full h-20 flex justify-between items-start p-5 bg-opacity-20 backdrop-blur-xl shadow-lg">
        <div className="flex flex-row justify-start align-middle">
          <img
            src={props.profilePic}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-slate-700 font-bold">{props.userName}</h1>
            {isShowTyping ? (
              <p className="text-slate-700 text-sm">
                {typingUser} is typing....
              </p>
            ) : (
              <p className="text-slate-700 text-sm">online</p>
            )}
          </div>
        </div>
        {isGroupChat ? (
          <button onClick={handleOpenChatInfo} className="bg-slate-800 hover:bg-slate-400 text-white font-bold h-10 w-10 rounded-full text-xl">
            <i className="fa-solid fa-circle-info"></i>
          </button>
        ) : null}
      </div>
      {isOpenChatInfo ? <ChatRoomMembers setIsOpenChatInfo={setIsOpenChatInfo}/> : null}
    </React.Fragment>
  );
}
