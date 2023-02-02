import styled from "styled-components";

const StyledMessage = styled.div`
  display: inline-block;
  background: #ffffff;
  border-radius: 10px;
  max-width: 240px;
  padding: 7px 10px;
`;

const Message = ({ userName, text }) => {
  return (
    <>
      <p style={{ margin: "0 0 8px 0" }}>{userName}</p>
      <StyledMessage>{text}</StyledMessage>
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

const StyledMyMessage = styled.div`
  display: inline-block;
  background: #ffffff;
  border-radius: 10px;
  max-width: 240px;
  padding: 7px 10px;
`;

const MyMessage = ({ text }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <StyledMyMessage>{text}</StyledMyMessage>
    </div>
  );
};

export { Message, AdminMessage, MyMessage };
