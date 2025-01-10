import { useState } from "react";
import PropTypes from "prop-types";

const SendMessage = ({ addMessage, loading }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }

    await addMessage(message);
    setMessage("");
  };
  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button disabled={loading} type="submit">
        Send
      </button>
    </form>
  );
};

SendMessage.propTypes = {
  scroll: PropTypes.object.isRequired,
};

export default SendMessage;
