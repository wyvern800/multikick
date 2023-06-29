import React, { useEffect , useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as Styled from "./styles";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Ads from "../Ads";

import { useSelector, useDispatch } from 'react-redux';

import { 
  setLoaded, 
  setActiveChat, 
  setStreams, 
  hoverLeftTab, 
  collapseLeftBar,
  hoverRightTab,
  collapseRightBar,
  setSearch,
  setOpen,
  setSelectedToDelete
} from '../../redux/impl/appSlice';

const Home = () => {
  const searchRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();

  const loadedRedux = useSelector((state) => state.app.loaded);
  const streamsRedux = useSelector((state) => state.app.streams);
  const activeChatRedux = useSelector((state) => state.app.activeChat);
  const collapsedLeftBarRedux = useSelector((state) => state.app.collapsedLeftBar);
  const hoveredLeftTabRedux = useSelector((state) => state.app.hoveredLeftTab);
  const collapseRightBarRedux = useSelector((state) => state.app.collapsedRightBar);
  const hoveredRightTabRedux = useSelector((state) => state.app.hoveredRightTab);
  const searchValueRedux = useSelector((state) => state.app.searchValue);
  const openRedux = useSelector((state) => state.app.open);
  const selectedToDeleteRedux = useSelector((state) => state.app.selectedToDelete);

  // const [open, setOpen] = useState(false);
  //const [selectedToDelete, setSelectedToDelete] = useState("");

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

    if (correctOrder.filter((username) => username !== "")?.length > 0) {
      correctOrder
        ?.filter((path) => path !== "")
        .map(async (username) => {
          await axios
            .get(`https://kick.com/api/v2/channels/${username}`)
            .then((response) => {
              if (response?.status === 200) {
                if (!selectedLives.includes(username)) {
                  selectedLives.push(username);
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
                dispatch(setStreams(ordered))
                dispatch(setActiveChat(ordered[0]))
                dispatch(collapseRightBar(false));
                dispatch(setLoaded(true));
              }, 1000);
            });
        });
    } else {
      // Base welcome screen
      dispatch(setStreams([]));
      dispatch(setActiveChat(null));
      dispatch(collapseRightBar(true));
      dispatch(setLoaded(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /**
   * Processa e adiciona o canal
   * @param {string} channel Nome do canal
   */
  const handleAddChannel = async (channel) => {
    if (channel === "") {
      toast.error("Stream name can not be empty!");
      return;
    }
    await axios
      .get(`https://kick.com/api/v2/channels/${channel}`)
      .then((response) => {
        if (response?.status === 200) {
          if (!streamsRedux.includes(channel)) {
            let copy = [...streamsRedux];
            copy.push(channel);
            dispatch(setStreams(copy))
            searchRef.current.value = "";

            // Se for o primeiro canal, ativar chat e descolapsa menu direito
            if (streamsRedux?.length === 0) {
              dispatch(setActiveChat(channel))
              dispatch(collapseRightBar(false));
            }
          } else {
            console.log(`Username ${channel} is already on list`);
            toast.error(`Username ${channel} is already on list`);
            searchRef.current.value = "";
            dispatch(setSearch(""));
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
          dispatch(setSearch(""));
        }
      });
  };

  /**
   * Procede com a deleção
   * @param {string} channel Canal
   */
  const handleDeletion = (channel) => {
    let copy = [...streamsRedux];

    const toDelete = copy.find((chan) => chan === channel);
    if (toDelete) {
      copy.splice(copy.indexOf(toDelete), 1);
      dispatch(setStreams(copy))
      dispatch(setOpen(false));
      
      // Se for o último canal aberto e for deletado, desligar o chat atual e esconder tab da dreita
      if (copy?.length === 0) {
        dispatch(setActiveChat(null));
        dispatch(collapseRightBar(true));
      }
    }
  };

  return (
    <>
      <Modal
        open={openRedux}
        onClose={() => {
          dispatch(setOpen(!openRedux));
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
        <h2>Are you sure you want to remove: <b>{selectedToDeleteRedux}</b>?</h2>
        <Styled.ModalButtons>
          <Styled.Button
            onClick={() => {
              handleDeletion(selectedToDeleteRedux);
            }}
          >
            Yes
          </Styled.Button>
          <Styled.Button
            onClick={() => {
              dispatch(setOpen(false));
              setTimeout(() => {
                dispatch(setSelectedToDelete(""));
              }, 500);
            }}
          >
            No
          </Styled.Button>
        </Styled.ModalButtons>
      </Modal>
      <Styled.Wrapper>
        {loadedRedux ? (
          <>
            {!collapsedLeftBarRedux ? (
              <>
                <Styled.LeftBar collapsed={collapsedLeftBarRedux}>
                  <Styled.TopSection>
                    <Styled.Header>
                      <Styled.CommandRow>
                        MultiKick.stream
                        <Styled.CollapseTabLeft
                          onClick={() => dispatch(collapseLeftBar(!collapsedLeftBarRedux))}
                        />
                      </Styled.CommandRow>
                    </Styled.Header>
                    <Styled.Commands>
                      Add the streams you want to watch
                      <Styled.SearchBar>
                        <Styled.Search
                          ref={searchRef}
                          placeholder={"Stream name here"}
                          onChange={(e) => dispatch(setSearch(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddChannel(searchValueRedux);
                            }
                          }}
                        />
                        <Styled.AddStream
                          onClick={() => handleAddChannel(searchValueRedux)}
                        />
                      </Styled.SearchBar>
                    </Styled.Commands>

                    <Styled.Header>
                      <Styled.CommandRow>
                        {streamsRedux?.length > 0 && <>Channels</>}
                        {/**<Styled.WatchAll>Watch All</Styled.WatchAll>**/}
                      </Styled.CommandRow>
                    </Styled.Header>

                    <Styled.Header>
                      <Styled.ChannelsRow>
                        {streamsRedux.map((channel, index) => {
                          return (
                            <Styled.CommandRow key={index}>
                              <Styled.ChannelName>{channel}</Styled.ChannelName>
                              <Styled.Actions>
                                <Styled.ToggleChat
                                  active={activeChatRedux === channel}
                                  onClick={() => {
                                    dispatch(setActiveChat(channel))
                                    dispatch(collapseRightBar(false));
                                  }}
                                />
                                <Styled.RemoveStream
                                  onClick={() => {
                                    dispatch(setOpen(true));
                                    dispatch(setSelectedToDelete(channel));
                                  }}
                                />
                              </Styled.Actions>
                            </Styled.CommandRow>
                          );
                        })}
                      </Styled.ChannelsRow>
                    </Styled.Header>
                  </Styled.TopSection>

                  <Styled.EmptyDiv border={true}/>

                  <Styled.ConsiderDonating>
                    <Ads dataAdSlot="2611193497" />
                    <Styled.EmptyDivBordered />
                    If you liked our service, consider sharing and donating to
                    keep it improving
                  </Styled.ConsiderDonating>
                </Styled.LeftBar>
              </>
            ) : (
              <Styled.BarCollapsed
                beingHovered={hoveredLeftTabRedux}
                onClick={() => dispatch(collapseLeftBar(!collapsedLeftBarRedux))}
                onMouseEnter={() => dispatch(hoverLeftTab(true))}
                onMouseLeave={() => dispatch(hoverLeftTab(false))}
              >
                <Styled.CollapseTabRight collapsed={collapsedLeftBarRedux} />
              </Styled.BarCollapsed>
            )}

            {streamsRedux?.length === 0 ? (
              <Styled.Streams>
                <Styled.Credits>
                  <Styled.Title>MultiKick.stream</Styled.Title>
                  Welcome to MultiKick! You can use this site to watch any
                  number of kick.com streams at the same time (as long as your
                  computer can handle it). Simply put the streams you want in
                  the url. For example: multikick.stream/godzamy. MultiKick will
                  optimize the layout of streams to give you the maximum size on
                  each of the streams, while maintaining aspect ratio. For the
                  curious, the source of this page is available at
                  github.com/wyvern800/multikick. Happy streamwatching!
                  <Styled.CreatedBy>
                    Created by Matheus Ferreira
                  </Styled.CreatedBy>
                </Styled.Credits>
              </Styled.Streams>
            ) : (
              <>
                <Styled.Streams amountOfChats={streamsRedux?.length}>
                  {streamsRedux.map((live, index) => {
                    return (
                      <Styled.LiveStream
                        key={index}
                        amountOfChats={streamsRedux?.length}
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
              </>
            )}

            {!collapseRightBarRedux ? (
              <Styled.ChatBar collapsed={collapseRightBarRedux}>
                <Styled.Header>
                  <Styled.CommandRow>
                    <Styled.CollapseTabRight
                      onClick={() => dispatch(collapseRightBar(!collapseRightBarRedux))}
                    />
                    {streamsRedux?.length === 0 ? (
                      <></>
                    ) : (
                      <>{activeChatRedux}'s Chat</>
                    )}
                  </Styled.CommandRow>
                </Styled.Header>

                {activeChatRedux !== null ? (
                  <Styled.CurrentChat
                    amountOfChats={streamsRedux?.length}
                    title={`Chat - ${activeChatRedux}`}
                    src={`https://kick.com/${activeChatRedux}/chatroom`}
                    frameBorder="0"
                  ></Styled.CurrentChat>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    Please, select a chat from any stream through the left panel
                    before having something here.
                  </div>
                )}
              </Styled.ChatBar>
            ) : (
              <Styled.BarCollapsed
                beingHovered={hoveredRightTabRedux}
                onClick={() => dispatch(collapseRightBar(!collapseRightBarRedux))}
                onMouseEnter={() => dispatch(hoverRightTab(true))}
                onMouseLeave={() => dispatch(hoverRightTab(false))}
              >
                <Styled.CollapseTabLeft collapsed={collapseRightBarRedux} />
              </Styled.BarCollapsed>
            )}
          </>
        ) : (
          <Styled.LoadingDiv>
            <Styled.Loader size={75} color={"#53fc18"} />
          </Styled.LoadingDiv>
        )}
      </Styled.Wrapper>
    </>
  );
};

export default Home;
