import { useState, useEffect, useRef } from "react";

function App() {
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chat, setChat] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const message = useRef("");

  useEffect(() => {
    fetch("/dummyData.json")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const selectChat = (e) => {
    e.preventDefault();
    const find = users.find((item) => item.id == e.target.id);
    setChat(find);
  };

  const collectMessage = (e) => {
    e.preventDefault();
    if (message.current.value !== "") {
      const data = {
        sender: "you",
        massage: message.current.value,
      };
      message.current.value = "";

      const updatedUsers = users.map((user) => {
        if (user.id == chat.id) {
          return { ...user, massage: [...user.massage, data] };
        }
        return user;
      });
      setUsers(updatedUsers);
      setChat((prevChat) => ({
        ...prevChat,
        massage: [...prevChat.massage, data],
      }));
    }
  };

  return (
    <>
      <div className="main flex justify-between">
        <div className="bg-yellow-200 left flex flex-col justify-between">
          <h1 className="text-4xl mt-3 ml-4 font-bold w-full">Chats</h1>
          <div className="flex">
            <input
              type="search"
              placeholder="Search chat by name......"
              className="ml-4 rounded-xl w-96 h-10 mb-5 mt-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user flex flex-col">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((data) => (
                <div
                  className="comp h-24 w-96 ml-4 mb-4 bg-slate-400 rounded-xl flex justify-around items-center cursor-pointer"
                  key={data.id}
                  id={data.id}
                  onClick={selectChat}
                >
                  <div
                    className="h-20 w-20 text-4xl font-bold border-2 border-yellow-200 flex justify-center items-center rounded-full"
                    id={data.id}
                    onClick={selectChat}
                  >
                    {data.name.charAt(0)}
                  </div>
                  <div
                    className="h-20 w-64 flex flex-col mb-2 ml-2 justify-center"
                    id={data.id}
                    onClick={selectChat}
                  >
                    <h1 className="text-2xl font-bold" id={data.id} onClick={selectChat}>
                      {data.name}
                    </h1>
                    <h3 className="capitalize" id={data.id} onClick={selectChat}>
                      {data.massage.length > 0
                        ? `${data.massage[data.massage.length - 1].massage}`
                        : "No Conversation Yet"}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <h3 className="text-2xl font-bold">No such contact exists</h3>
              </div>
            )}
          </div>
        </div>
        {chat && chat.massage && Object.keys(chat).length > 0 ? (
          <div className="bg-yellow-200 right flex flex-col">
            <h1 className="mt-3 text-4xl font-bold ml-7">{chat.name}</h1>
            <div className="innerchat border-2 border-slate-400 rounded-xl flex flex-col">
              {chat.massage.map((data, index) => (
                <div
                  key={index}
                  className={`min-h-10 max-w-72 bg-slate-400 mt-3 rounded-xl flex items-center pl-2 pr-2 pt-2 pb-2 ${
                    data.sender === "she"
                      ? " ml-3 border-4 border-green-500"
                      : "ml-[715px] border-4 border-blue-400"
                  }`}
                >
                  {data.massage}
                </div>
              ))}
            </div>
            <div className="input flex justify-around items-center ">
              <input
                type="text"
                className="h-12 w-[75%] rounded-lg border-2 border-slate-400"
                ref={message}
              />
              <button
                className="h-12 w-40 bg-green-600 rounded-xl"
                id={chat.id}
                onClick={collectMessage}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-200 right flex justify-center items-center">
            <h1 className="text-4xl font-bold">No Conversation Open</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
