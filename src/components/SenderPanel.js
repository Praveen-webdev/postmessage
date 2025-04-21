import React, { useState } from "react";

const SenderPanel = ({ receiverRef }) => {
  const [message, setMessage] = useState("");
  const [safeOrigin, setSafeOrigin] = useState("*");

  const sendMessage = (targetOrigin) => {
    if (receiverRef.current) {
      receiverRef.current.postMessage(message, targetOrigin);
    } else {
      alert("The receiver has not been created yet.");
    }
  };

  return (
    <div className="panel sender-panel">
      <h2>Sender Panel</h2>
      <textarea
        placeholder="Enter your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div style={{ marginBottom: "10px",display: "flex", gap: "5px" }}>
        <input
          type="text"
          value={safeOrigin}
          onChange={(e) => setSafeOrigin(e.target.value)}
          placeholder="Enter origin"
          style={{
            width: "calc(70% - 10px)",
            padding: "8px",
            fontSize: "14px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={() => sendMessage(safeOrigin)}
          style={{ width: "28%" }}
          className="primary-button"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default SenderPanel;
