import React from "react";
import { useAppSelector } from "../../app/hooks";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export default function SingleMessageItem(props: {
  index: any;
  sender: string;
  content: string;
  time: string;
  profilePic: any;
  readList: any;
}) {
  const { user } = useAppSelector((state) => state.user);
  const thread = useAppSelector((state) => state.chat);
  const loggedInUser = user.firstName;
  

const isSent = props.sender === loggedInUser;
  
const isGroupChat = thread.members.length > 2;
const hasOnlyLoggedInUser = props.readList.length === 1 ;
console.log("RER",hasOnlyLoggedInUser,props.readList.length)
const isReceived = isSent // If the message is sent by the loggedIn user, it is always considered received by themself
  || (isGroupChat && props.readList.length >= 3) // For group chats, at least three members should be in the readList for it to be considered received by all
  || (!isGroupChat && props.readList.length >= 2); // For normal chats, at least two members (sender + recipient) should be in the readList for it to be considered received



const getMemberUsernames = () => {
  return props.readList.map((memberId: string) => {
    const member = thread.members.find((member) => member.id === memberId);
    return member ? member.username : memberId;
  });
};
// console.log("SENT",thread.members,props.readList,getMemberUsernames().join(", "))

  return (
    <React.Fragment>
      <div
        key={props.index.toString()}
        className={`flex flex-col justify-start w-fit max-w-md h-fit rounded-xl p-2 m-5 ${
          isSent 
            ? `bg-slate-800 text-slate-200 self-end`
            : `bg-slate-200 text-slate-800 self-start`
        }`}
      >
        <div className="flex flex-row items-center self-start">
          <img src={props.profilePic} alt="" className="w-8 h-8 rounded-full" />
          <h1 className="ml-2 text-sm font-bold">{props.sender}</h1>
        </div>
        <p className="p-1">{props.content}</p>
        <p className="self-end mt-4 text-sm">{props.time}</p>
        <p>
        {isSent && hasOnlyLoggedInUser && (
          <span className="text-xs text-gray-400" title={"Sent"}>
            <DoneIcon />
          </span>
        )}
        {isSent && !hasOnlyLoggedInUser && isReceived && isGroupChat && (
          <span className="text-xs text-blue-500" title={getMemberUsernames().join(", ")}>
            <DoneAllIcon />
          </span>
        )}
        {isSent && !hasOnlyLoggedInUser && isReceived && !isGroupChat && (
          <span className="text-xs text-blue-500" title={getMemberUsernames().join(", ")}>
            <DoneAllIcon />
          </span>
        )}
        </p>
      </div>
    </React.Fragment>
  );
}
