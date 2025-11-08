import { useState, useRef } from 'react';
import './App.css';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import axios from 'axios';
import flag from './assets/Flag_of_India.svg'

function App() {
  const data = `
      👋 Namaste!
      I am your Indian Constitutional AI Assistant, trained to help you understand the Constitution of India.
      You can ask me any question related to Indian law, articles, amendments, or fundamental rights — just like consulting a professional lawyer.
      <br/>
      🧠 Ask me anything about the Indian Constitution — I’m here to help!
      <br/><br/>
      👋 नमस्ते!
      मैं आपका भारतीय संविधान आधारित एआई सहायक हूँ, जो आपको भारतीय संविधान को समझने में मदद करेगा।
      आप मुझसे संविधान के अनुच्छेदों, संशोधनों, मौलिक अधिकारों या किसी कानूनी विषय पर प्रश्न पूछ सकते हैं — जैसे आप किसी पेशेवर वकील से सलाह ले रहे हों।
      <br/>
      🧠 भारतीय संविधान से जुड़ा कोई भी प्रश्न पूछें — मैं आपकी मदद के लिए यहाँ हूँ!
  `
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      position: 'left',
      type: 'text',
      text: data,
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
    <>
    <div className='main'>
      <img src={flag} alt="Law Logo" />
      <h1 style={{ marginLeft: '10px'}}>Indian Constitutional AI Assistant</h1>
    </div>
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

      <div className="input-row">
        <Input
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          multiline={false}
        />
        <Button text="Send" onClick={handleSend} />
      </div>

    </div>
    </>
  );
}

export default App;
