# react-nodejs-chat

### server
- node.js, express
- socket.io

### client
- react, styled-components, context api
- socket.io-client

### play
<div style="display: flex;">
  <img style="width: 250px;" src="https://user-images.githubusercontent.com/86469788/216759365-aafcfbae-01ad-4512-a0bc-ad2d7a4f3d78.png">
  <img style="width: 250px;" src="https://user-images.githubusercontent.com/86469788/216534195-f11220e2-6eb5-49ca-a11a-25f8790b3ea1.png">
</div>

- 방 이름 입력해서 채팅방 만들기
- 그 방에 들어가서 채팅하기
- 방 인원수가 0이 되면 채팅방 사라짐

### data
- room : { roomId, roomName, capacity, createDate }
- user : { userId, userName, roomId }
- roomData : { roomId, roomName, capacity, createDate, users }
- message : { userName, text } -> DB에 저장할 땐 roomId 필요

#### enterLobby
- roomList : { rooms, cntArr }

#### addRoom
- roomId : { roomId }

#### joinRoom
- message : { userName, text }
- roomData : { roomId, roomName, capacity, createDate, users }

#### sendMessage
- message : { userName, text }

#### leaveRoom or disconnect
- message : { userName, text }
- roomData : { users }

### if add DB
- 채팅방 메시지(실시간 데이터): 테이블 하나에 몰아 넣고 채팅방 아이디로 조회 -> NoSQL: mongodb, firebase, ...
- 그외 채팅방 정보, 현재 채팅방 인원 등 -> SQL: mysql, oracle, ...
