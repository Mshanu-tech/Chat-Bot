import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! How can I help you today?" }]);
  const [input, setInput] = useState("");
  const user_id = 1; // example user id

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("https://chatbot-backend-wech.onrender.com/chat", { user_id, message: input });
      const botMessage = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const botMessage = { from: "bot", text: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Convert table text to JSX table
  const renderTable = (text) => {
    const lines = text.split("\n");
    if (lines.length < 2 || !lines[0].includes("|")) return text; // not a table

    const headers = lines[0].split("|").map((h) => h.trim());
    const rows = lines.slice(2).map((row) => row.split("|").map((cell) => cell.trim()));

    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} style={{ border: "1px solid #ccc", padding: "4px", background: "#f1f1f1" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              {r.map((cell, cidx) => (
                <td key={cidx} style={{ border: "1px solid #ccc", padding: "4px" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", border: "1px solid #ccc", borderRadius: "10px", padding: "10px", fontFamily: "Arial" }}>
      <h3 style={{ textAlign: "center" }}>💬 Customer Service Chatbot</h3>
      <div style={{ height: "400px", overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "90%", padding: "8px 12px", borderRadius: "16px", background: msg.from === "user" ? "#007bff" : "#f1f1f1", color: msg.from === "user" ? "white" : "black" }}>
              {msg.from === "bot" && msg.text.includes("|") ? renderTable(msg.text) : msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={{ marginLeft: "8px", padding: "10px 16px", borderRadius: "8px", background: "#007bff", color: "white", border: "none" }}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
