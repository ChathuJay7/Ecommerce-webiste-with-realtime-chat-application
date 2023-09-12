import React, { useEffect, useRef, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import SingleChatItem from "../../components/Chat/SingleChatItem";
import ChatSideBar from "../../components/Chat/ChatSideBar";
import ChatRoomWindow from "../../components/Chat/ChatRoomWindow";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getCurrentThreadMessages, getAllThreadMessages, getUserThreads } from "../../API/Chat/ChatAPI";
import { useDispatch } from "react-redux";
import { setSelectedThread } from "../../app/Redux/Chat/ChatSlice";
import ChatWelcomeScreen from "../../components/Chat/ChatWelcomeScreen";
import { io } from "socket.io-client";
import useNotification from "../../utils/notificationState";


export default function ChatApp() {
  const socket = io("http://localhost:8080");
  const [bearerToken, setBearerToken] = useState("");
  const [threadList, setThreadList] = useState<any[]>([]);
  const { user } = useAppSelector((state) => state.user);
  const thread = useAppSelector((state) => state.chat);
  const [messageList, setMessageList] = useState<any[]>([]);
  const dispatch = useDispatch();

  const [emptyReadListCount, setEmptyReadListCount] = useState<{ index: number; count: number; username: string }[]>([]);
  const [notification, setNotification] = useState<{ index: number; count: number; username: string; threadName: string}[]>([]);

  // console.log("RTC",thread)

  // console.log("notifications", notification);

  useEffect(() => {
    console.log("RTCOPEN",thread.isOpen);
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }

    socket.on("receiveNotification", async (res: any) => {
      if (threadList) {
        const threadInList = threadList.find(
          (tid: { _id: any }) => tid._id === res.threadId
        );

        if (threadInList) {
          const isGroupChat = threadInList.isGroupChat;
          const threadName = isGroupChat
            ? threadInList.threadName
            : threadInList.members
                .filter((member: any) => member.id !== user.id)
                .map((member: any) => member.username)
                .join(", ");

          if (threadInList._id === thread.id && user.id !== res.senderId) {
            console.log("Chat Opened");
          } else if (threadInList._id !== thread.id) {
            const updatedNotification = [
              {
                index: threadList.findIndex(
                  (tid: { _id: any }) => tid._id === res.threadId
                ),
                count: 1,
                username: res.senderName,
                threadName: threadName,
              },
              ...notification,
            ];
            setNotification(updatedNotification);

            // Get Empty ReadList for the thread receiving the notification
            const threadId = res.threadId;
            await getAllThreadMessages({ id: threadId })
              .then((response: any) => {
                let emptyReadListCount = 0;
                let username = "";

                response.data.forEach((message: { readList: string | any[]; authorUsername: any }) => {
                  if (message.readList.length === 1) {
                    emptyReadListCount++;
                    username = message.authorUsername;
                  }
                });

                setEmptyReadListCount((prevEmptyReadList) => [
                  ...prevEmptyReadList,
                  { index: threadList.findIndex((tid: { _id: any }) => tid._id === threadId), count: emptyReadListCount, username },
                ]);
                // console.log("sdsa",emptyReadListCount)
              })
              .catch((error: any) => {
                console.error("Error fetching thread messages:", error);
              });
          }
        }
      }
    });
    
    return () => {
      socket.off("receiveNotification");
    };
    
  }, [socket]);

  useEffect(() => {

    const fetchThreads = async () => {
      try {
        
        const response = await getUserThreads(bearerToken, user);

        if (response.success) {
          // Handle the successful response
          setThreadList(response.data);
  
          // Get Empty ReadList 
          const threadIds = response.data.map((thread: any) => ({ id: thread._id }));
          const getMessagesPromises = threadIds.map((id: any) => getAllThreadMessages(id));
          const getMessagesArray = await Promise.all(getMessagesPromises);
  
          const updatedEmptyReadListCount = getMessagesArray.map((response, index) => {
            let emptyReadListCount = 0;
            let username = "";
  
            response.data.forEach((message: { readList: string | any[]; authorUsername: any}) => {
              if (message.readList.length === 1 && message.authorUsername !== user.firstName) {
                emptyReadListCount++;
                username = message.authorUsername;
              }
            });
  
            return { index, count: emptyReadListCount, username };
          });
  
          setEmptyReadListCount(updatedEmptyReadListCount);
          // console.log("sdsa",updatedEmptyReadListCount)
        
        } else {
          // Handle the error case
          console.error(response.error);
        }
      } catch (error) {
        // Handle any exception during the API call
        console.error(error);
      }
    };
    fetchThreads();
  }, [user]);

  // console.log("LISTTHREAD",threadList);

  const handleClick = (
    id: any,
    members: any,
    isGroupChat: any,
    threadName: any
  ) => {
    dispatch(
      setSelectedThread({
        id: id,
        members: members,
        isGroupChat: isGroupChat,
        threadName: threadName,
      })
    );
    setMessageList([]);


  };

  const handleChatItemClick = (index: number) => {
    // Update the notification for the clicked thread to 0
    const updatedNotification = notification.map((item) =>
      item.index === index ? { ...item, count: 0 } : item
    );
  
    setNotification(updatedNotification);
    setEmptyReadListCount(updatedNotification);
    // Set the unreadNotifications to 0
    // setUnreadNotifications(0);
  };

  const notificationCounts = threadList.map((item, index) =>
    emptyReadListCount.find((count) => count.index === index)?.count || 0
  );
  // console.log("ff",notificationCounts);

  const uniqueNotifications = Array.isArray(notification)
    ? Array.from(new Set(notification.map(item => item.index)))
        .map(index => {
          const count = notification
            .filter(item => item.index === index)
            .reduce((total, item) => total + item.count, 0);

          return {
            index,
            count,
          };
        })
    : [];
    // console.log("ff",uniqueNotifications);
    
    
 
  return (
    <React.Fragment>      
      <TopNav
        // topNavHeading={"🛒 E-commerce App"}
        // btnName={"Account"}
        // btnAction={undefined}
        notificationCount={notification}
      />
      <div className="flex items-center justify-center h-screen pt-16">
        <ChatSideBar>
          {threadList.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                handleClick(
                  item._id,
                  item.members,
                  item.isGroupChat,
                  item.threadName
                )
              }
              className="w-full"
            >
              <SingleChatItem
                index={index}
                threadName={
                  item.isGroupChat
                    ? item.threadName
                    : item.members.find(
                        (member: { id: string }) => member.id !== user.id
                      )?.username
                }
                lastMsgDate={"2023/07/05"}
                lastMsg={"Hey whats up bro??"}
                notification={
                  emptyReadListCount.find((count) => count.index === index)?.count!
                    ? emptyReadListCount.find((count) => count.index === index)?.count! + (uniqueNotifications.find((count) => count.index === index)?.count || 0)
                    : (uniqueNotifications.find((count) => count.index === index)?.count || 0)
                }
                onClick={() => handleChatItemClick(index)}

              />
            </div>
          ))}
        </ChatSideBar>
        {thread.isOpen ? (
          <ChatRoomWindow
            threadList ={threadList}
            messageList={messageList}
            setMessageList={setMessageList}
            socket={socket}
          />
        ) : (
          <ChatWelcomeScreen />
        )}
      </div>
    </React.Fragment>
  );
}
