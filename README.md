# react-nodejs-chat

### server
- node.js, express
- socket.io

### client
- react, styled-components, context api
- socket.io-client
- timeago.js

### database
- nosql: firebase-firestore

### play
<div style="display: flex;">
  <img style="width: 250px;" src="https://user-images.githubusercontent.com/86469788/216759365-aafcfbae-01ad-4512-a0bc-ad2d7a4f3d78.png">
  <img style="width: 250px;" src="https://user-images.githubusercontent.com/86469788/216534195-f11220e2-6eb5-49ca-a11a-25f8790b3ea1.png">
</div>

- 방 이름 입력해서 채팅방 만들기
- 그 방에 들어가서 채팅하기
- 방 인원수가 0이 되면 채팅방 사라짐

### data
- chat : { userName, text, date, roomId }
- user : { userId, userName, roomId }
- room : { roomId, roomName, capacity, createDate }

#### enterLobby
- roomList : { rooms, cntArr }

#### addRoom
- roomId : { roomId }

#### joinRoom
- message : { userName, text, date, roomId }
- roomData : { roomId, roomName, capacity, createDate, chats, users }

#### sendMessage
- message : { userName, text, date, roomId }

#### leaveRoom or disconnect
- message : { userName, text, date, roomId }
- roomData : { users }
