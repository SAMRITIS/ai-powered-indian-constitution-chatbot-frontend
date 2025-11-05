import { useState, useRef } from 'react';
import './App.css';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import axios from 'axios';

function App() {
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      position: 'left',
      type: 'text',
      text: 'Hello! Ask me anything about the Constitution of India.',
      date: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');

  const formatText = (text) => {
    if (!text) return '';
    let formatted = text.replace(/\*\*(.+?)\*\*/g, (match, p1) => {
      return `<h2 style="font-size:18px;font-weight:bold;margin:3px 0;">${p1}</h2>`;
    });
    formatted = formatted.replace(/\*(.+?)\*/g, (match, p1) => {
      return `<strong style="font-weight:600;color:#333;">${p1}</strong>`;
    });
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      position: 'right',
      type: 'text',
      text: inputValue,
      date: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    const response = await axios.get(`http://127.0.0.1:5000/query?query=${inputValue}`);

    setTimeout(() => {
      const aiMessage = {
        position: 'left',
        type: 'text',
        text: formatText(response?.data?.result.replace('**Final Answer**', '')),
        date: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const renderMessageText = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <MessageList
        ref={messageListRef}
        className="message-list"
        lockable={true}
        toBottomHeight={'100%'}
        dataSource={messages.map((msg) => ({
          ...msg,
          text: renderMessageText(msg.text),
        }))}
      />

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <Input
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          multiline={false}
          style={{ flex: 1 }}
        />
        <Button text="Send" onClick={handleSend} style={{ marginLeft: '10px' }} />
      </div>
    </div>
  );
}

export default App;
