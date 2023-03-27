import styled from "styled-components";
import { format, register } from "timeago.js";
import koLocale from "timeago.js/lib/lang/ko";

const StyledMessage = styled.div`
  display: inline-block;
  position: relative;
  background: #ffffff;
  border-radius: 10px;
  max-width: 240px;
  padding: 7px 10px;
  &::after {
    position: absolute;
    left: -7px;
    bottom: 18px;
    content: "◀";
    color: #ffffff;
    transform: rotate(33deg);
  }
`;

const StyledDate = styled.span`
  font-size: 10px;
  vertical-align: bottom;
  margin: 0 5px;
`;

register("ko", koLocale);

const Message = ({ userName, text, date }) => {
  return (
    <>
      <p style={{ margin: "0 0 8px 0" }}>{userName}</p>
      <StyledMessage>{text}</StyledMessage>
      <StyledDate>{format(date, "ko")}</StyledDate>
    </>
  );
};

const StyledAdminMessage = styled.div`
  display: inline-block;
  background: #ffffff;
  border-radius: 20px;
  max-width: 300px;
  padding: 3px 14px;
`;

const AdminMessage = ({ text }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <StyledAdminMessage>{text}</StyledAdminMessage>
    </div>
  );
};

const StyledMyWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledMyMessage = styled.div`
  display: inline-block;
  position: relative;
  background: #ffffff;
  border-radius: 10px;
  max-width: 240px;
  padding: 7px 10px;
  &::after {
    position: absolute;
    right: -7px;
    bottom: 18px;
    content: "▶";
    color: #ffffff;
    transform: rotate(-33deg);
  }
`;

const MyMessage = ({ text, date }) => {
  return (
    <StyledMyWrap>
      <div>
        <StyledDate>{format(date, "ko")}</StyledDate>
        <StyledMyMessage>{text}</StyledMyMessage>
      </div>
    </StyledMyWrap>
  );
};

export { Message, AdminMessage, MyMessage };
