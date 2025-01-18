import { useState, useRef } from "react";
import PropTypes from "prop-types";
import SendIcon from "../../icons/SendIcon";
import AddIcon from "../../icons/AddIcon";
import "./SendMessage.css";

const SendMessage = ({ addMessage, loading }) => {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const imageRef = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    await addMessage(message, selectedImages);
    setMessage("");
    setSelectedImages([]);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    setSelectedImages(files);

    const urls = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result);
        // Update previewUrls only after all files are read
        if (urls.length === files.length) {
          setSelectedImages(urls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleButtonClick = () => {
    imageRef.current.click();
  };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label htmlFor="file">
            <AddIcon onClick={handleButtonClick} />
            <span className="tooltip">Add an image</span>
          </label>
          <input
            name="file"
            id="file"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            hidden
            ref={imageRef}
          />
        </div>
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
  );
};

SendMessage.propTypes = {
  scroll: PropTypes.object.isRequired,
};

export default SendMessage;
