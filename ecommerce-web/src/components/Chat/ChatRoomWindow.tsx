import React, { useEffect, useRef, useState } from "react";
import SingleMessageItem from "./SingleMessageItem";
import ChatRoomHeader from "./ChatRoomHeader";
import profilePic from "../../assets/images/profile-pic.png";
import ChatRoomFooter from "./ChatRoomFooter";
import { useAppSelector } from "../../app/hooks";
import { getCurrentThreadMessages } from "../../API/Chat/ChatAPI";
import axios from "axios";

export default function ChatRoomWindow(props: {
  threadList: any,
  messageList: any;
  setMessageList: any;
  socket: any;
}) {
  // const socket = io("http://localhost:8080");
  const scrollToDownRef = useRef<HTMLInputElement>(null);
  const thread = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.user);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);

  useEffect(() => {
    console.log("thread.id", thread.id);
    if (scrollToDownRef.current) {
      scrollToDownRef.current.scrollIntoView({ behavior: "smooth" });
    }
    const joinRoomObj = {
      roomId: thread.id,
    };
    props.socket.emit("joinRoom", joinRoomObj);
    
    const handleReceiveMessage = async (data: any) => {
      console.log("RECEIVED_MESSAGE", data);
    
      try {
        const response = await axios.patch(
          `http://localhost:8080/api/v1/message/${data._id}/markAsRead`,
          {
            readList: [user.id],
          }
        );
    
        console.log("PATCH", response);
    
        // Update messageList state after the patch function is complete
        props.setMessageList((prevMessageList: any[]) => [
          ...prevMessageList.filter((item) => item._id !== data._id),
          response.data,
        ]);
    
        // console.log("hehe", response.data, data._id);
    
        // Get the updated messageList state and log it
        const updatedMessageList = await getCurrentThreadMessages(thread);
        console.log("Updated Message List:", updatedMessageList);
    
        // Check if the message is from another user
        if (data.authorId !== user.id) {
          console.log("MessageRead");
        } else {
          console.log("MY OWN MESSAGE");
    
          // Check if the readList is empty
          console.log("RESPONSE", updatedMessageList);
    
          const filteredMessages = updatedMessageList.data.filter(
            (item: { _id: any; readList: any[] }) =>
              item._id === data._id && item.readList.length > 0
          );
          console.log("Filtered Messages:", filteredMessages);
    
          // Update messageList state based on readList
          if (filteredMessages.length === 0) {
            props.setMessageList((prevMessageList: any[]) => [
              ...prevMessageList.filter((item) => item._id !== data._id),
              data,
            ]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    props.socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      props.socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [props.socket]);   

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getCurrentThreadMessages(thread);
        console.log("RESPONSE2",response);

        // Update the Fetched Previous Messages in Current thread
        // let emptyReadListCount = 0;
        response.data.forEach((message: {
          _id: any; readList: string | any[]; 
        }) => {
          if (message.readList.length === 1) {
            // emptyReadListCount++;
            // console.log("COUNT",message._id);
            console.log("MessageRead");
            axios.patch(`http://localhost:8080/api/v1/message/${message._id}/markAsRead`,{
            readList: [user.id],
            }).then(response => {
              console.log("PATCH2",response)
            })
            .catch(error => {
              console.log(error)
            });
          }else{console.log("Already CaughtUP")}
        });

        if (response.success) {
          // Handle the successful response
          setMessageHistory(response.data);
        } else {
          // Handle the error case
          console.error(response.error);
        }
      } catch (error) {
        // Handle any exception during the API call
        console.error(error);
      }
    };
    
    fetchMessages();
  }, [thread.id]);

  // console.log(props.messageList);

  return (
    <React.Fragment>
      <div className="w-3/4 h-full overflow-x-hidden overflow-y-scroll">
        <ChatRoomHeader
          userName={
            thread.isGroupChat
              ? thread.threadName
              : thread.members.find(member => member.id !== user.id)?.username
          }
          profilePic={profilePic}
          socket={props.socket}
        />
        <div className="flex flex-col items-center justify-end min-h-screen">
          {messageHistory.map((item: any, index: any) => (
            <SingleMessageItem
              key={index}
              index={index}
              sender={item.authorUsername}
              content={item.content}
              time={item.sendTime}
              profilePic={profilePic}
              readList = {item.readList}
            />
          ))}
          {props.messageList.map((item: any, index: any) => (
            <SingleMessageItem
              key={index}
              index={index}
              sender={item.authorUsername}
              content={item.content}
              time={item.sendTime}
              profilePic={profilePic}
              readList = {item.readList}
            />
          ))}
          
          <ChatRoomFooter
            socket={props.socket}
            setMessageList={props.setMessageList}
          />
          <div ref={scrollToDownRef}></div>
        </div>
      </div>
    </React.Fragment>
  );
}
