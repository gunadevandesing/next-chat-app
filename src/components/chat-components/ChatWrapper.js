"use client";
import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";

const models = [
  {
    name: "Model 1",
    value: "g",
  },
  {
    name: "Model 2",
    value: "m",
  },
];

const getResponse = async (message, modelName) => {
  const response = await fetch(`/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, modelName }),
  });
  const data = await response.json();
  console.log({ data });
  return data;
};

const ChatWrapper = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const [loading, setLoading] = useState(false);
  const modelRef = useRef("g");

  const addMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        text: message,
        name: "User",
      },
      {
        id: prevMessages.length + 2,
        text: "Loading...",
        name: "Loader",
      },
    ]);
    setLoading(true);
    getResponse(message, modelRef.current?.value)
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.name !== "Loader"),
          {
            id: prevMessages.length + 1,
            text: response.response,
            name: "AI",
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.name !== "Loader"),
          {
            id: prevMessages.length + 1,
            text: "Sorry, I couldn't get that. Please try again.",
            name: "AI",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (messages.length > 0)
      scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div>
        <select ref={modelRef} className="model-select">
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} addMessage={addMessage} loading={loading} />
    </>
  );
};

export default ChatWrapper;
