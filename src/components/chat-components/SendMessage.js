import { useState } from "react";
import { Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import SendIcon from "../../icons/SendIcon";
import AddIcon from "../../icons/AddIcon";
import "./SendMessage.css";

const SendMessage = ({
  addMessage,
  loading,
  // modal,
  setModal,
  selectedImages,
  setSelectedImages,
}) => {
  const [message, setMessage] = useState("");

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

  const handleAttachModal = () => {
    setModal((prevState) => ({ ...prevState, open: true }));
  };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label onClick={handleAttachModal}>
            <AddIcon />
            {selectedImages.length > 0 && (
              <Badge className="mx-1" pill bg="light" text="dark">
                {selectedImages.length < 10 ? selectedImages.length : "9+"}
              </Badge>
            )}
            <span className="tooltip">Add image</span>
          </label>
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
