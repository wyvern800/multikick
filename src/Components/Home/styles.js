import styled, { css } from "styled-components";
import bg from "../../assets/images/ui-bg_highlight-soft_44_444444_1x100.png";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { BsPlus } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { ClipLoader } from 'react-spinners';

export const Wrapper = styled.div`
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

  overflow-y: hidden;
`;

export const WrapperCredits = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Streams = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
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
  ${(props) =>
    props.amountOfChats >= 5 &&
    css`
      justify-content: flex-start;
      align-items: flex-start;
    `}
`;

export const LiveStream = styled.iframe`
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

export const ChatBar = styled.div`
  width: 302px;
  height: 100vh;
  min-width: 302px;
  margin: 0;
  padding: 0;
  background-color: #191b1f;
  color: white;
  position: sticky;

  @media (max-width: 1200px) {
    display: none;
  }

  ${(props) =>
    props.collapsed &&
    css`
      display: none;
    `}
`;

export const LeftBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  min-width: 293px;
  max-width: 293px;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #191b1f;
  color: white;
  position: sticky;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1200px) {
    display: none;
  }

  ${(props) =>
    props.collapsed &&
    css`
      display: none;
    `}
`;

export const BarCollapsed = styled.div`
  display: flex;
  flex-direction: column;
  width: 20px;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #191b1f;
  color: white;
  position: sticky;
  align-items: center;
  justify-content: center;

  @media (max-width: 1200px) {
    display: none;
  }

  &&:hover {
    background-color: #333333;
    cursor: pointer;
  }

  ${props => props.beingHovered && css`
    color: #53fc18;
  `}
`;

export const ChatTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
  gap: 0 1px;

  overflow-y: auto;
  max-height: 60px;
`;

export const ChatTab = styled.div`
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

export const CurrentChat = styled.iframe`
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

export const Credits = styled.div`
  color: white;
  width: 35%;
  height: fit-content;
  border: 1px solid #53fc18;
  align-items: center;
  justify-content: space-between;
  padding: 2%;
  border-radius: 10px;

  @media (max-width: 1200px) {
    width: 60%;
    border: 0;
    margin: 10px;
    font-size: 3vw;
  }
`;

export const Link = styled.a`
  color: #53fc18;
  word-wrap: wrap;

  &&:visited,
  &&:active {
    color: #53fc18;
  }

  &&:hover {
    color: gold;
  }
`;

export const Title = styled.h2`
  font-weight: bold;
  color: #53fc18;
`;

export const CreatedBy = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 5%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export const Commands = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5px;
`;

export const CommandRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
`;

export const ChannelsRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  flex-direction: column;
  max-height: 695px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SearchBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  position: relative;
`;

export const Search = styled.input`
  width: 100%;
  outline: none;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 0;
  border-radius: 5px;
`;

export const CollapseTabLeft = styled(IoIosArrowDropleft)`
  font-size: 2rem;

  &&:hover {
    cursor: pointer;
    color: #53fc18;
  }

  ${props => props.collapsed && css`
    font-size: 1.2rem;
  `}
`;

export const CollapseTabRight = styled(IoIosArrowDropright)`
  font-size: 2rem;
  margin: 5px;

  &&:hover {
    cursor: pointer;
  }

  ${props => props.collapsed && css`
    font-size: 1.2rem;
  `}
`;

export const AddStream = styled(BsPlus)`
  color: black;
  position: absolute;
  font-size: 2rem;
  //margin-left: -1.5px;
  z-index: 100;
  right: 0;

  &&:hover {
    cursor: pointer;
    color: #53fc18;
  }
`; 

export const ToggleChat = styled(HiOutlineChatBubbleOvalLeftEllipsis)`
  font-size: 2rem;
  right: 0;

  &&:hover {
    cursor: pointer;
    color: #53fc18;
  }
  
  ${(props) =>
    props.active &&
    css`
      color: #53fc18;
    `}
`; 

export const RemoveStream = styled(TiDelete)`
  font-size: 2rem;
  right: 0;

  &&:hover {
    cursor: pointer;
    color: red;
  }
`; 

export const WatchAll = styled.div`
  border: 1px solid white;
  padding-left: 3px;
  padding-right: 3px;
  font-size: 0.8rem;

  &&:hover {
    cursor: pointer;
    color: #53fc18;
    border-color: #53fc18;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 5px;
`;

export const ChannelName = styled.span`
  font-size: 0.7vw;
`;

export const EmptyDiv = styled.div`
  display: none;
`;

export const TopSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ConsiderDonating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #24272C;
  padding: 5px;
  text-align: center;
`;

export const ModalButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 15px;
  border: 0;
  outline: none;
  background-color: transparent;
  border: 1px solid white;
  color: white;

  &&:hover {
    cursor: pointer;
    color: #53fc18;
    border: 1px solid #53fc18;
  }
`;

export const LoadingDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

export const Loader = styled(ClipLoader)``;