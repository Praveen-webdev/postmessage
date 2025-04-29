import React, { useState, useRef } from "react";
import "./App.css";
import SenderPanel from "./components/SenderPanel";
import ReceiverPanel from "./components/ReceiverPanel";

function App() {
  const [receiverType, setReceiverType] = useState("popup"); // 'popup' or 'iframe'
  const [receiverUrl, setReceiverUrl] = useState(""); // URL to open
  const receiverRef = useRef(null);

  const createReceiver = () => {
    if (receiverType === "popup") {
      receiverRef.current = window.open(
        receiverUrl || "",
        "Receiver",
        "width=600,height=400,left=200,top=200"
      );
      // receiverRef.current.opener = null;
      if (!receiverUrl) {
        receiverRef.current.document.write(`
          <div id="root">Receiver panel</div>
          <div id="log"></div>
          <script>
            window.addEventListener('message', (event) => {
              const logDiv = document.getElementById('log');
              const message = document.createElement('div');
              message.textContent = 'Received: ' + JSON.stringify(event.data);
              logDiv.appendChild(message);

              // Respond to the sender
              event.source.postMessage({ type: 'response', content: 'Message received in popup!' }, event.origin);
            });
          </script>
        `);
      }
    } else if (receiverType === "iframe") {
      const iframe = document.getElementById("receiverIframe");
      if (receiverUrl) {
        iframe.src = receiverUrl;
      } else {
        iframe.srcdoc = `
          <h3 id="root">Receiver Iframe</h3>
          <div id="log"></div>
          <button id="sendMessage">Send Message to Parent</button>
          <script>
            // Send a message to the parent window
            document.getElementById('sendMessage').addEventListener('click', () => {
              window.parent.postMessage({ type: 'fromIframe', content: 'Hello Parent!' }, '*');
            });

            // Listen for messages from any source
            window.addEventListener('message', (event) => {
              const logDiv = document.getElementById('log');
              const message = document.createElement('div');
              message.textContent = 'Received: ' + JSON.stringify(event.data);
              logDiv.appendChild(message);


              // Respond to the sender
              event.source.postMessage({ type: 'response', content: 'Message received in iframe!' }, event.origin);
            });
          </script>
        `;
      }
      receiverRef.current = iframe.contentWindow;
    }
  };

  return (
    <div className="app-container">
      <h2>Controller</h2>
      <div className="receiver-type-selector">
        <label>
          <input
            type="radio"
            value="popup"
            checked={receiverType === "popup"}
            onChange={() => setReceiverType("popup")}
          />
          Popup
        </label>
        <label>
          <input
            type="radio"
            value="iframe"
            checked={receiverType === "iframe"}
            onChange={() => setReceiverType("iframe")}
          />
          Iframe
        </label>
        <input
          type="text"
          placeholder="Enter URL to open"
          value={receiverUrl}
          onChange={(e) => setReceiverUrl(e.target.value)}
        />
        <button className="secondary-button" onClick={createReceiver}>
          Create Receiver
        </button>
      </div>
      <div className="panels">
        <SenderPanel receiverRef={receiverRef} />
        <ReceiverPanel />
      </div>
      {receiverType === "iframe" && (
        <iframe
          id="receiverIframe"
          title="Receiver"
          className="receiver-iframe"
        />
      )}
    </div>
  );
}

export default App;
