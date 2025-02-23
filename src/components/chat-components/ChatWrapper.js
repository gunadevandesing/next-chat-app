"use client";
import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import AttachFileModal from "../common/ModalComponent/AttachFileModal";

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
if (process.env.NODE_ENV === "development") {
  models.push({
    name: "Model 3",
    value: "o",
  });
}

const getResponse = async (message, modelName, imageUrls, messages) => {
  const response = await fetch(`/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, modelName, imageUrls, messages }),
  });
  const data = await response.json();
  return data;
};

const ChatWrapper = () => {
  const [messages, setMessages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const scroll = useRef();
  const [loading, setLoading] = useState(false);
  const modelRef = useRef("g");

  const [modal, setModal] = useState({
    open: false,
  });

  const addMessage = async (message, imageUrls) => {
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
    getResponse(
      message,
      modelRef.current?.value,
      Array.isArray(imageUrls) ? imageUrls : [],
      messages
    )
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

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array

    const existingImages = [...selectedImages];
    const urls = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result);
        // Update previewUrls only after all files are read
        if (urls.length === files.length) {
          existingImages.push(...urls);

          setSelectedImages(existingImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (messages.length > 0)
      scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="model-select-wrapper">
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
          <Message key={message.name + message.id} message={message} />
        ))}
      </div>
      <span ref={scroll}></span>
      <SendMessage
        scroll={scroll}
        addMessage={addMessage}
        loading={loading}
        modal={modal}
        setModal={setModal}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />

      {modal.open && (
        <AttachFileModal
          show={modal.open}
          handleClose={() =>
            setModal((prevState) => ({ ...prevState, open: false }))
          }
          handleImageChange={handleImageChange}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      )}
    </>
  );
};

export default ChatWrapper;
