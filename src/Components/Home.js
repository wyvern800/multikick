import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import axios from "axios";
import bg from "../assets/images/ui-bg_highlight-soft_44_444444_1x100.png";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgb(11, 14, 15);
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;

  // Disable select
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`;

const Streams = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 100vw;
  overflow-y: auto;

  // 2 or more channels
  ${(props) =>
    props.amountOfChats === 2 &&
    css`
      justify-content: center;
      align-items: center;
      flex-direction: column;
    `}

  // 3 or more channels
  ${(props) =>
    props.amountOfChats >= 3 &&
    css`
      width: 100%;
    `}

  // 5 or more channels
  ${(props) => props.amountOfChats >= 5 && css`
      justify-content: flex-start;
      align-items: flex-start;
  `}
`;

const LiveStream = styled.iframe`
  // One chat
  ${(props) =>
    props.amountOfChats === 1 &&
    css`
      width: 100%;
      height: 100%;
    `}

  // Two chats
  ${(props) =>
    props.amountOfChats === 2 &&
    css`
      width: 50%;
      height: 50%;
    `}

  // More than 3 channels  
  ${(props) =>
    props.amountOfChats >= 3 &&
    css`
      flex-basis: 50%;
      height: 50%;
    `}

    // More than 5 channels  
  ${(props) =>
    props.amountOfChats >= 5 &&
    css`
      flex-basis: 25%;
      //height: 40%;
    `}
`;

const ChatBar = styled.div`
  width: 302px;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #191b1f;
  color: white;
  position: sticky;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const ChatTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
  gap: 0 1px;

  overflow-y: auto;
  max-height: 60px;
`;

const ChatTab = styled.div`
  border: 1px solid #333333;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 5px;
  padding-bottom: 4px;
  border-radius: 5px 5px 0px 0px;
  flex-grow: 1;

  background: #444444 url(${bg}) 50% 50% repeat-x;
  text-align: center;

  ${(props) =>
    props.active &&
    css`
      border-color: #53fc18;
      font-weight: bold;
      background: rgb(2, 0, 36);
      background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(#53fc18),
        to(#2b9c02)
      );
      text-shadow: 1px 1px 2px black;
    `}

  &&:hover {
    cursor: pointer;
  }
`;

const CurrentChat = styled.iframe`
  height: 92vh;

  ${(props) =>
    props.amountOfChats <= 4 &&
    css`
      height: 95vh;
    `}

  ${(props) =>
    props.amountOfChats > 4 &&
    css`
      height: 93vh;
    `}
`;

const Home = () => {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [liveStreams, setLiveStreams] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  /**
   * Ordenar array
   * @param {any} array Array
   * @param {any} order Array
   * @returns
   */
  const orderArray = (array, order) => {
    return array.sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      return indexA - indexB;
    });
  };

  // Pega os nomes das lives
  useEffect(() => {
    document.title = "multikick";

    let selectedLives = [];
    const correctOrder = location?.pathname.split("/");

    correctOrder
      ?.filter((path) => path !== "")
      .map(async (username) => {
        await axios
          .get(`https://kick.com/api/v2/channels/${username}`)
          .then((response) => {
            if (response?.status === 200) {
              if (!selectedLives.includes(username)) {
                selectedLives.push(username);
              } else {
                console.log('username already present');
              }
            }
            return username;
          })
          .catch((err) => {
            if (
              err?.response?.data?.message ===
              "No query results for model [App\\Models\\Channel]."
            ) {
              console.log(`Username ${username} not found`);
            }
          })
          .finally(() => {
            setTimeout(() => {
              const ordered = orderArray(selectedLives, correctOrder);
              setLiveStreams(ordered);
              setCurrentChat(ordered[0]);
              setLoaded(true);
            }, 1000);
          });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    loaded && (
      <Wrapper>
        <Streams amountOfChats={liveStreams?.length}>
          {liveStreams.map((live, index) => {
            return (
              <LiveStream
                key={index}
                amountOfChats={liveStreams?.length}
                title={`Livestream - ${live}`}
                width="401"
                height="226"
                src={`https://player.kick.com/${live}?muted=${
                  index === 0 ? "false" : "true"
                }`}
                frameBorder="0"
                allowFullScreen
              ></LiveStream>
            );
          })}
        </Streams>
        <ChatBar>
          <ChatTabs>
            {liveStreams.map((live, index) => {
              return (
                <ChatTab
                  key={index}
                  active={currentChat === live}
                  onClick={() => {
                    setCurrentChat(live);
                  }}
                >
                  {live}
                </ChatTab>
              );
            })}
          </ChatTabs>
          {currentChat !== null && (
            <CurrentChat
              amountOfChats={liveStreams?.length}
              title={`Chat - ${currentChat}`}
              src={`https://kick.com/${currentChat}/chatroom`}
              frameBorder="0"
            ></CurrentChat>
          )}
        </ChatBar>
      </Wrapper>
    )
  );
};

export default Home;
