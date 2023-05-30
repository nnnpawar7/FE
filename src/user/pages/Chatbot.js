import React, { useState, Component } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import "./Chatbot.css";
import { DBPedia, Chip } from "./search";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#0f4d4a",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#0f4d4a",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

// all available config props
const config = {
  width: "300px",
  height: "400px",
  hideUserAvatar: true,
  placeholder: "Type your response.",
  headerTitle: "ChatBot",
};

const Chatbot = (props) => {
  let [showChat, setShowChat] = useState(false);

  const startChat = () => {
    setShowChat(true);
  };
  const hideChat = () => {
    setShowChat(false);
  };

  return (
    <div className="bot">
      <ThemeProvider theme={theme}>
        <div style={{ display: showChat ? "" : "none" }}>
          <ChatBot
            speechSynthesis={{ enable: true, lang: "en-US" }}
            recognitionEnable={true}
            steps={[
              {
                id: "welcome",
                message: "Hello!",
                trigger: "q-firstname",
              },
              {
                id: "q-firstname",
                message: "What is your name?",
                trigger: "firstname",
              },
              {
                id: "firstname",
                user: true,
                validator: (value) => {
                  if (/^[A-Za-z]+$/.test(value)) {
                    return true;
                  } else {
                    return "Please input alphabet characters only.";
                  }
                },
                trigger: "help-message",
              },
              {
                id: "help-message",
                message: "Hi {previousValue}, how can I help you",
                trigger: "help-options",
              },
              {
                id: "help-options",
                options: [
                  {
                    value: 1,
                    label: "Suggest me the places to visit",
                    trigger: "ask-recent-place",
                  },
                  { value: 2, label: "Login problem", trigger: "login_solution"},
                  { value: 3, label: "About AR gallery works" },
                  { value: 4, label: "About view on map section" },
                  { value: 5, label: "Others" },
                ],
              },
              {id:"login_solution", component:<LoginSolution/>},
              {
                id: "ask-recent-place",
                message: "Enter the place you visted recently",
                trigger: "get-recent-place",
              },
              {
                id:"get-recent-place",
                user: true,
                validator: (value) => {
                    if (/^[A-Za-z]+$/.test(value)) {
                      return true;
                    } else {
                      return "Please input alphabet characters only.";
                    }
                  },
                  trigger:"suggest-new-places"
                
            },{
                id:"suggest-new-places",
                component: <DBPedia  style={{ backgroundColor: 'transparent' }}/>,
                waitAction: true,
            }, {
              id:"print_tourist_places",
              component:<TestCo></TestCo>
            }
            ]}
            {...config}
          />
        </div>
        <div>
          {!showChat ? (
            <button className="btn" onClick={() => startChat()}>
              +
            </button>
          ) : (
            <button className="btn" onClick={() => hideChat()}>
              -
            </button>
          )}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Chatbot;

class TestCo extends Component {

  render() {
    const pls = this.props.steps["suggest-new-places"]?.value;
    console.log('1-------------', pls)
    return (
      <div style={{ width: '100%', paddingRight: '10px', background: 'transparent' }}>
          {(pls || []).map((r)=><Chip name={r.name} key={r.name}></Chip>)}
    </div>
    );
  }
}

const LoginSolution = ()=>{
  return (<div><p>Follow below steps</p>
  <ol>
    <li>Enter the correct username</li>
    <li>Enter the correct password</li>
  </ol></div>)
}