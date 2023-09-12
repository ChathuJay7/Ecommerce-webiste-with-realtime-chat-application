import React, { useState } from "react";
import profilePic from "../../assets/images/profile-pic.png";

export default function SingleChatItem(props: {
  index?: any;
  threadName?: string;
  lastMsgDate?: string;
  lastMsg?: string;
  deleteBtnAction?: any;
  notification?: any;
  onClick?: any;
}) {
  const [showDeleteChat, setShowDeleteChat] = useState(false);
  const truncatedThreadName =
    (props.threadName ?? "").length > 18
      ? (props.threadName ?? "").substring(0, 18) + "..."
      : props.threadName ?? "";
  return (
    <React.Fragment>
      <div
        key={props.index.toString()}
        className="flex flex-row items-center justify-between w-full h-20 p-2 my-1 cursor-pointer bg-slate-300 hover:bg-slate-400 rounded-xl text-slate-800"
        onMouseEnter={() => setShowDeleteChat(!showDeleteChat)}
        onMouseLeave={() => setShowDeleteChat(!showDeleteChat)}
        onClick={props.onClick}
      >
        <div className="flex flex-row items-center justify-start">
          <img src={profilePic} alt="" className="w-12 h-12 rounded-full" />
          <div className="ml-4">
            <h1 className="font-bold">{truncatedThreadName}</h1>
            <p className="text-xs text-slate-600">{props.lastMsgDate}</p>
            <p className="text-xs text-slate-600">
              {props.lastMsg?.slice(0, 20) + "..."}
            </p>
            <p className="text-xs text-slate-600">{props.notification}</p>
          </div>
        </div>

        {showDeleteChat && (
          <button
            onClick={props.deleteBtnAction}
            className="w-8 h-8 text-sm text-white rounded-full bg-slate-500 hover:bg-rose-600"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
