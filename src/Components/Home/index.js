import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as Styled from "./styles";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const Home = () => {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [liveStreams, setLiveStreams] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [duplicate, setDuplicate] = useState(false);
  const [collapseLeftBar, setCollapseLeftBar] = useState(false);
  const [hoveredLeftTab, setHoveredLeftTab] = useState(false);
  const [collapseRightBar, setCollapseRightBar] = useState(false);
  const [hoveredRightTab, setHoveredRightTab] = useState(false);
  const [empty, setEmpty] = useState(false);

  const [searchInputValue, setSearchInputValue] = useState("");

  const searchRef = useRef();

  const [open, setOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState("");

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

    // Corrige a tela de greetings
    if (correctOrder.filter((username) => username !== "")?.length === 0)
      setEmpty(true);

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
                setDuplicate(true);
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
            if (duplicate) {
              toast.info(
                "There was a duplicate channel passed by the URL, we removed that for you"
              );
            }
            setTimeout(() => {
              const ordered = orderArray(selectedLives, correctOrder);
              setLiveStreams(ordered);
              setCurrentChat(ordered[0]);
              setLoaded(true);
            }, 1000);
          });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /**
   * Processa e adiciona o canal
   * @param {string} channel Nome do canal
   */
  const handleAddChannel = async (channel) => {
    await axios
      .get(`https://kick.com/api/v2/channels/${channel}`)
      .then((response) => {
        if (response?.status === 200) {
          if (!liveStreams.includes(channel)) {
            let copy = [...liveStreams];
            copy.push(channel);
            setLiveStreams(copy);
            searchRef.current.value = "";
          } else {
            console.log(`Username ${channel} is already on list`);
            toast.error(`Username ${channel} is already on list`);
            searchRef.current.value = "";
          }
        }
      })
      .catch((err) => {
        if (
          err?.response?.data?.message ===
          "No query results for model [App\\Models\\Channel]."
        ) {
          console.log(`Username ${channel} not found`);
          toast.error("Username was not found!");
          searchRef.current.value = "";
        }
      });
  };

  /**
   * Procede com a deleção
   * @param {string} channel Canal
   */
  const handleDeletion = (channel) => {
    let copy = [...liveStreams];
    const toDelete = copy.find((chan) => chan === channel);
    if (toDelete) {
      copy.splice(copy.indexOf(toDelete), 1);
      setLiveStreams(copy);
      setOpen(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
        styles={{
          modal: {
            background: "#191B1F",
            color: "white",
            borderRadius: "10px",
          },
        }}
        center
      >
        <h2>Are you sure you want to remove: {selectedToDelete}?</h2>
        <Styled.ModalButtons>
          <Styled.Button
            onClick={() => {
              handleDeletion(selectedToDelete);
            }}
          >
            Yes
          </Styled.Button>
          <Styled.Button
            onClick={() => {
              setOpen(false);
              setTimeout(() => {
                setSelectedToDelete("");
              }, 500);
            }}
          >
            No
          </Styled.Button>
        </Styled.ModalButtons>
      </Modal>
      <Styled.Wrapper>
        {loaded && liveStreams.length > 0 ? (
          <>
            {!collapseLeftBar ? (
              <>
                <Styled.LeftBar collapsed={collapseLeftBar}>
                  <Styled.TopSection>
                    <Styled.Header>
                      <Styled.CommandRow>
                        MultiKick.stream
                        <Styled.CollapseTabLeft
                          onClick={() => setCollapseLeftBar(!collapseLeftBar)}
                        />
                      </Styled.CommandRow>
                    </Styled.Header>
                    <Styled.Commands>
                      Add the streams you want to watch
                      <Styled.SearchBar>
                        <Styled.Search
                          ref={searchRef}
                          placeholder={"Stream name here"}
                          onChange={(e) => setSearchInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddChannel(searchInputValue);
                            }
                          }}
                        />
                        <Styled.AddStream
                          onClick={() => handleAddChannel(searchInputValue)}
                        />
                      </Styled.SearchBar>
                    </Styled.Commands>

                    <Styled.Header>
                      <Styled.CommandRow>
                        Channels
                        {/**<Styled.WatchAll>Watch All</Styled.WatchAll>**/}
                      </Styled.CommandRow>
                    </Styled.Header>

                    <Styled.Header>
                      <Styled.ChannelsRow>
                        {liveStreams.map((channel, index) => {
                          return (
                            <Styled.CommandRow key={index}>
                              <Styled.ChannelName>{channel}</Styled.ChannelName>
                              <Styled.Actions>
                                <Styled.ToggleChat
                                  active={currentChat === channel}
                                  onClick={() => {
                                    setCurrentChat(channel);
                                  }}
                                />
                                <Styled.RemoveStream
                                  onClick={() => {
                                    setOpen(true);
                                    setSelectedToDelete(channel);
                                  }}
                                />
                              </Styled.Actions>
                            </Styled.CommandRow>
                          );
                        })}
                      </Styled.ChannelsRow>
                    </Styled.Header>
                  </Styled.TopSection>

                  <Styled.EmptyDiv />

                  <Styled.ConsiderDonating>
                    If you liked our service, consider sharing and donating to
                    keep it improving
                  </Styled.ConsiderDonating>
                </Styled.LeftBar>
              </>
            ) : (
              <Styled.BarCollapsed
                beingHovered={hoveredLeftTab}
                onClick={() => setCollapseLeftBar(!collapseLeftBar)}
                onMouseEnter={() => setHoveredLeftTab(true)}
                onMouseLeave={() => setHoveredLeftTab(false)}
              >
                <Styled.CollapseTabRight collapsed={collapseLeftBar} />
              </Styled.BarCollapsed>
            )}

            <Styled.Streams amountOfChats={liveStreams?.length}>
              {liveStreams.map((live, index) => {
                return (
                  <Styled.LiveStream
                    key={index}
                    amountOfChats={liveStreams?.length}
                    title={`Livestream - ${live}`}
                    width="401"
                    height="226"
                    src={`https://player.kick.com/${live}?muted=${
                      index === 0 ? "true" : "false"
                    }&autoplay=true`}
                    frameBorder="0"
                    allowFullScreen
                  ></Styled.LiveStream>
                );
              })}
            </Styled.Streams>

            {!collapseRightBar ? (
              <Styled.ChatBar collapsed={collapseRightBar}>
                <Styled.Header>
                  <Styled.CommandRow>
                    <Styled.CollapseTabRight
                      onClick={() => setCollapseRightBar(!collapseRightBar)}
                    />
                    {currentChat}'s Chat
                  </Styled.CommandRow>
                </Styled.Header>
                {/*<Styled.ChatTabs>
              {liveStreams.map((live, index) => {
                return (
                  <Styled.ChatTab
                    key={index}
                    active={currentChat === live}
                    onClick={() => {
                      setCurrentChat(live);
                    }}
                  >
                    {live}
                  </Styled.ChatTab>
                );
              })}
            </Styled.ChatTabs>*/}

                {currentChat !== null && (
                  <Styled.CurrentChat
                    amountOfChats={liveStreams?.length}
                    title={`Chat - ${currentChat}`}
                    src={`https://kick.com/${currentChat}/chatroom`}
                    frameBorder="0"
                  ></Styled.CurrentChat>
                )}
              </Styled.ChatBar>
            ) : (
              <Styled.BarCollapsed
                beingHovered={hoveredRightTab}
                onClick={() => setCollapseRightBar(!collapseRightBar)}
                onMouseEnter={() => setHoveredRightTab(true)}
                onMouseLeave={() => setHoveredRightTab(false)}
              >
                <Styled.CollapseTabLeft collapsed={collapseRightBar} />
              </Styled.BarCollapsed>
            )}
          </>
        ) : !loaded && !empty ? (
          <Styled.LoadingDiv>
            <Styled.Loader size={75} color={"#53fc18"} />
          </Styled.LoadingDiv>
        ) : (
          <Styled.WrapperCredits>
            <Styled.Credits>
              <Styled.Title>MultiKick.stream</Styled.Title>
              Welcome to MultiKick! You can use this site to watch any number of
              kick.com streams at the same time (as long as your computer can
              handle it). Simply put the streams you want in the url. For
              example: multikick.stream/godzamy. MultiKick will optimize the
              layout of streams to give you the maximum size on each of the
              streams, while maintaining aspect ratio. For the curious, the
              source of this page is available at
              github.com/wyvern800/multikick. Happy streamwatching!
              <Styled.CreatedBy>Created by Matheus Ferreira</Styled.CreatedBy>
            </Styled.Credits>
          </Styled.WrapperCredits>
        )}
      </Styled.Wrapper>
    </>
  );
};

export default Home;
