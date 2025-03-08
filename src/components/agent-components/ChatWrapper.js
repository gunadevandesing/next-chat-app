"use client";
import "../chat-components/SendMessage.css";
import "../../app/home.css";
import React, { useState } from "react";
import Message from "../chat-components/Message";
import SendIcon from "../../icons/SendIcon";

const getResponse = async (message) => {
  const response = await fetch(`/api/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic: message }),
  });
  const data = await response.json();
  return data;
};

const ChatWrapper = () => {
  const [qNA, setQNA] = useState({
    question: "",
    answer: "",
    summary: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    setLoading(true);
    setQNA((prevState) => ({
      ...prevState,
      question: message,
    }));
    getResponse(message)
      .then((response) => {
        setQNA((prevState) => ({
          ...prevState,
          answer: response.firstResult,
          summary: response.secondResult,
        }));
      })
      .catch((error) => {
        console.error(error);

        setQNA((prevState) => ({
          ...prevState,
          answer: "Error",
          summary: "Error",
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="messages-wrapper">
        <Message
          key={"welcome"}
          message={{
            name: "AI",
            text: "Welcome to the chatbot!",
          }}
        />
        {qNA?.question && (
          <Message
            key={"question"}
            message={{
              name: "User",
              text: qNA.question,
            }}
          />
        )}
        {loading ? (
          <Message
            key={"loader"}
            message={{
              name: "Loader",
              text: "Loading...",
            }}
          />
        ) : (
          <>
            {qNA?.answer && (
              <Message
                key={"answer"}
                message={{
                  name: "AI",
                  text: qNA.answer,
                }}
              />
            )}
            {qNA?.summary && (
              <Message
                key={"summary"}
                message={{
                  name: "AI",
                  text: qNA.summary,
                }}
              />
            )}
          </>
        )}

        <form onSubmit={(event) => sendMessage(event)} className="send-message">
          <div className="messageBox">
            <input
              id="messageInput"
              name="messageInput"
              type="text"
              className="form-input__input"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button id="sendButton" disabled={loading} type="submit">
              <SendIcon color={loading ? "#6c6c6c" : "#fff"} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatWrapper;
