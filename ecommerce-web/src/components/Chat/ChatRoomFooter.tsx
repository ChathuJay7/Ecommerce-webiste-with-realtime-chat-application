import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../app/hooks";

export default function ChatRoomFooter(props: {
  socket: any;
  setMessageList: any;
}) {
  const [messageTxt, setMessageTxt] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const { id } = useAppSelector((state) => state.chat);

  useEffect(() => {}, []);

  const handleKeyPressMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleOnChangeMessage = (e: any) => {
    setMessageTxt(e.target.value);
    const data = {
      username: user.firstName,
    };
    props.socket.emit("userTyping", data);
  };

  function sendMessage() {
    const messageObj = {
      content: messageTxt,
      authorId: user.id,
      authorUsername: user.firstName,
      threadId: id,
    };
    console.log("messageObjAuthorId", messageObj.authorId);
    props.socket.emit("sendMessage", messageObj);
    setMessageTxt("");
  }

  return (
    <React.Fragment>
      <div className="w-full flex flex-row m-5 items-center sticky bottom-0 p-5 bg-white">
        <input
          type="text"
          placeholder="Type message here..."
          className="flex-1 p-2 border border-gray-300 rounded-l-xl focus:outline-none ml-5"
          onChange={(e: any) => handleOnChangeMessage(e)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleKeyPressMessage(e)
          }
          value={messageTxt}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-r-xl bg-emerald-500 hover:bg-emerald-700 text-white font-bold focus:outline-none mr-5"
        >
          Send
        </button>
      </div>
    </React.Fragment>
  );
}
