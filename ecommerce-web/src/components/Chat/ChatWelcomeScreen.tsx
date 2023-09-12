import React from "react";
import chatBg from "../../assets/images/chatBg.png";

export default function ChatWelcomeScreen() {
  return (
    <React.Fragment>
      <div className="w-3/4 h-full overflow-y-scroll overflow-x-hidden flex flex-col justify-center items-center">
        <img src={chatBg} alt="" className="w-auto h-auto"/>
        <h1 className="font-semibold text-lg text-slate-400">To start chatting, please select the chat from the left side.</h1>
      </div>
    </React.Fragment>
  );
}
