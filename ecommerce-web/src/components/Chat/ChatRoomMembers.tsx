import React, { useEffect, useState } from "react";
import { getCurrentThread } from "../../API/Chat/ChatAPI";
import { useAppSelector } from "../../app/hooks";

export default function ChatRoomMembers(props: { setIsOpenChatInfo: any }) {
  const [groupMembers, setGroupMembers] = useState([]);
  const [threadName, setThreadName] = useState("");
  const { id } = useAppSelector((state) => state.chat);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCurrentThread({
        id: id,
      });
      if (response.success) {
        console.log(response.data);
        setThreadName(response.data.threadName);
        setGroupMembers(response.data.members);
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="absolute h-full top-0 left-0 bg-slate-800 bg-opacity-75 w-full z-50 flex justify-center items-center">
        <div className="w-96 h-4/6 p-12 rounded-lg bg-slate-100 text-slate-900">
          <h1 className="text-3xl font-bold">{threadName}</h1>
          <h5 className="text-slate-500 mt-3 mb-10 font-semibold text-md flex flex-row">
            All members{" "}
            <p className="text-slate-600 font-bold ml-2">
              ({groupMembers.length})
            </p>
          </h5>
          <div className="bg-slate-200 p-5 min-h-fit max-h-48 overflow-y-scroll">
            {groupMembers.map((item: any, index: any) => (
              <p className="text-sm my-4" key={index.toString()}>
                {item.username}
              </p>
            ))}
          </div>
          <div className="flex flex-row justify-end items-center">
            <button
              onClick={() => props.setIsOpenChatInfo(false)}
              className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded mt-5"
            >
              close
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
