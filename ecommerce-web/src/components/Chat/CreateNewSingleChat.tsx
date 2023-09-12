import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { filterUsers, getAllUsers } from "../../API/User/UserAPI";
import { createSingleThread } from "../../API/Chat/ChatAPI";

export default function CreateNewSingleChat(props: { isOpen: any }) {
  const [username, setUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [bearerToken, setBearerToken] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [userList, setUserList] = useState([]);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
    setLoggedInUserId(user.id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers();

        if (response.success) {
          // Handle the successful response
          setUserList(response.data);
          console.log(response.data);
        } else {
          // Handle the error case
          console.error(response.error);
        }
      } catch (error) {
        // Handle any exception during the API call
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setIsUserListVisible(false);
    console.log(user);
  };

  const handleUserRemove = (user: any) => {
    setSelectedUser("");
  };

  const handleInputChange = async (e: any) => {
    const username = e.target.value;
    setUsername(username);

    const data = {
      username,
    };
    const response = await filterUsers(data);

    if (response.success) {
      const filteredUserList = response.data.filter(
        (user: any) => user.id !== loggedInUserId
      );

      setUserList(filteredUserList);
      console.log(filteredUserList);

      if (username.length > 0 && filteredUserList.length > 0) {
        setIsUserListVisible(true);
      } else {
        setIsUserListVisible(false);
      }
    } else {
      setUserList([]);
      setIsUserListVisible(false);
    }
  };

  const handleSubmit = async () => {
    // Create the payload with the logged-in user ID and the selected user ID
    const payload = {
      members: [{id: user.id, username: user.firstName + " " + user.lastName}, {id: selectedUser.id, username: selectedUser.firstName + " " + selectedUser.lastName}],
    };
    console.log(payload);

    const response = await createSingleThread(payload);

    if (response.success) {
      console.log(response.data);
      props.isOpen(false);
    } else {
      console.error(response.error);
      toast.error(response.error);
    }
  };

  return (
    <React.Fragment>
      <div className="absolute top-0 left-0 bg-slate-800 bg-opacity-75 w-full h-full z-50 flex justify-center items-center">
        <div className="w-96 h-auto p-10 rounded-lg bg-slate-100 text-slate-900">
          <ToastContainer />
          <h1 className="text-3xl font-bold">Start Single Chat</h1>
          <h5 className="text-slate-400">Select the user</h5>
          <div className="flex flex-row w-full justify-center items-center mt-10">
            <input
              type="text"
              placeholder="Enter username"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none ml-5"
              onChange={handleInputChange}
              value={username}
            />
            <button className="px-4 py-2 rounded-r-lg bg-emerald-500 hover:bg-emerald-700 text-white font-bold focus:outline-none">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          {isUserListVisible && (
            <ul className="mt-2 p-2 bg-white border border-gray-300 rounded-md">
              {userList.map((user: any) => (
                <li
                  key={user.id}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.firstName}
                </li>
              ))}
            </ul>
          )}

          {selectedUser && (
            <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md">
              <h5 className="font-bold mb-2">Selected User</h5>

              <div className="flex items-center justify-between mb-1">
                <span>{selectedUser.firstName}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleUserRemove(selectedUser)}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-row justify-end items-center">
            <button
              onClick={() => props.isOpen(false)}
              className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded mt-5"
            >
              close
            </button>
            <button
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mt-5 ml-2"
              disabled={!selectedUser}
            >
              Start <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
