/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

const ReceiverPanel = () => {
  const [logs, setLogs] = useState([]);
  const [originCheck, setOriginCheck] = useState(window.location.origin);

  const handleMessage = (event) => {
    const { data, origin } = event;

    // Filter out unwanted messages
    if (typeof data === "object" && data.type?.startsWith("webpack")) {
      return;
    }
    if (typeof data === "string" && data.startsWith("webpack")) {
      return;
    }

    const passedCheck = origin === originCheck;

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: new Date().toLocaleTimeString(),
        data: typeof data === "object" ? JSON.stringify(data) : data, // Ensure data is a string
        origin,
        passedCheck,
      },
    ]);
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [originCheck]);

  return (
    <div className="panel receiver-panel">
      <h2>Receiver Panel</h2>
      <label>
        Origin Check:
        <input
          type="text"
          value={originCheck}
          onChange={(e) => setOriginCheck(e.target.value)}
        />
      </label>
      <p style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}>
        Check for the origin and process the data
      </p>
      <div className="log-viewer">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`log-entry ${
              log.passedCheck ? "log-accepted" : "log-rejected"
            }`}
          >
            [{log.timestamp}] {log.origin}: {log.data} (
            {log.passedCheck ? "Accepted" : "Rejected"})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiverPanel;
