import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [retrievedChunks, setRetrievedChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion() {
    if (!query) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setRetrievedChunks([]);

    try {
      const response = await fetch(`http://127.0.0.1:8000/query?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.answer) {
        setAnswer(data.answer);
        setRetrievedChunks(data.retrieved_chunks || []);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Error contacting backend");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  return (
    <div className="App">
      <h1>RAG Cyber Log Assistant</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your question or log entry..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={askQuestion} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="answer-container">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}

      {retrievedChunks.length > 0 && (
        <div className="chunks-container">
          <h3>Retrieved Chunks:</h3>
          <ul>
            {retrievedChunks.map((chunk, idx) => (
              <li key={idx}>{chunk}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="error-container">
          <h3>Error:</h3>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
