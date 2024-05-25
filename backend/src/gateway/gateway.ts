import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Services, WebsocketEvents } from '../utils/constants';
import { AuthenticatedSocket } from '../utils/interfaces';
import {
  CallAcceptedPayload,
  CallHangUpPayload,
  VoiceCallPayload,
} from '../utils/types';
import { CreateCallDto } from './dtos/CreateCallDto';
import { IGatewaySessionManager } from './gateway.session';

@WebSocketGateway()
export class MessagingGateway
{
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
  ) {}

  @WebSocketServer()
  server: Server

  @OnEvent('group.user.leave')
  handleGroupUserLeave(payload) {
    console.log('inside group.user.leave');
    const ROOM_NAME = `group-${payload.group.id}`;
    const { rooms } = this.server.sockets.adapter;
    const socketsInRoom = rooms.get(ROOM_NAME);
    const leftUserSocket = this.sessions.getUserSocket(payload.userId);

    console.log(socketsInRoom);
    console.log(leftUserSocket);
    if (leftUserSocket && socketsInRoom) {
      console.log('user is online, at least 1 person is in the room');
      if (socketsInRoom.has(leftUserSocket.id)) {
        console.log('User is in room... room set has socket id');
        return this.server
          .to(ROOM_NAME)
          .emit('onGroupParticipantLeft', payload);
      } else {
        console.log('User is not in room, but someone is there');
        leftUserSocket.emit('onGroupParticipantLeft', payload);
        this.server.to(ROOM_NAME).emit('onGroupParticipantLeft', payload);
        return;
      }
    }
    if (leftUserSocket && !socketsInRoom) {
      console.log('User is online but there are no sockets in the room');
      return leftUserSocket.emit('onGroupParticipantLeft', payload);
    }
  }

  @SubscribeMessage('getOnlineFriends')
  async handleFriendListRetrieve(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const { user } = socket;
    if (user) {
      console.log('user is authenticated');
      console.log(`fetching ${user.name}'s friends`);
      // const friends = await this.friendsService.getFriends(user.id);
      // const onlineFriends = friends.filter((friend) =>
      //   this.sessions.getUserSocket(
      //     user.id === friend.receiver.id
      //       ? friend.sender.id
      //       : friend.receiver.id,
      //   ),
      // );
      // socket.emit('getOnlineFriends', onlineFriends);
    }
  }

  @SubscribeMessage('onVideoCallInitiate')
  async handleVideoCall(
    @MessageBody() data: CreateCallDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('onVideoCallInitiate');
    const caller = socket.user;
    const receiverSocket = this.sessions.getUserSocket(data.recipientId);
    if (!receiverSocket) socket.emit('onUserUnavailable');
    receiverSocket.emit('onVideoCall', { ...data, caller });
  }

  @SubscribeMessage('videoCallAccepted')
  async handleVideoCallAccepted(
    @MessageBody() data: CallAcceptedPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const callerSocket = this.sessions.getUserSocket(data.caller.id);
    // const conversation = await this.conversationService.isCreated(
    //   data.caller.id,
    //   socket.user.id,
    // );
    // if (!conversation) return console.log('No conversation found');
    // if (callerSocket) {
    //   console.log('Emitting onVideoCallAccept event');
    //   const payload = { ...data, conversation, acceptor: socket.user };
    //   callerSocket.emit('onVideoCallAccept', payload);
    //   socket.emit('onVideoCallAccept', payload);
    // }
  }

  @SubscribeMessage(WebsocketEvents.VIDEO_CALL_REJECTED)
  async handleVideoCallRejected(
    @MessageBody() data,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('inside videoCallRejected event');
    const receiver = socket.user;
    const callerSocket = this.sessions.getUserSocket(data.caller.id);
    callerSocket &&
      callerSocket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, { receiver });
    socket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, { receiver });
  }

  @SubscribeMessage('videoCallHangUp')
  async handleVideoCallHangUp(
    @MessageBody() { caller, receiver }: CallHangUpPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('inside videoCallHangup event');
    if (socket.user.id === caller.id) {
      const receiverSocket = this.sessions.getUserSocket(receiver.id);
      socket.emit('onVideoCallHangUp');
      return receiverSocket && receiverSocket.emit('onVideoCallHangUp');
    }
    socket.emit('onVideoCallHangUp');
    const callerSocket = this.sessions.getUserSocket(caller.id);
    callerSocket && callerSocket.emit('onVideoCallHangUp');
  }

  @SubscribeMessage('onVoiceCallInitiate')
  async handleVoiceCallInitiate(
    @MessageBody() payload: VoiceCallPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const caller = socket.user;
    const receiverSocket = this.sessions.getUserSocket(payload.recipientId);
    if (!receiverSocket) socket.emit('onUserUnavailable');
    receiverSocket.emit('onVoiceCall', { ...payload, caller });
  }

  @SubscribeMessage(WebsocketEvents.VOICE_CALL_ACCEPTED)
  async handleVoiceCallAccepted(
    @MessageBody() payload: CallAcceptedPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('Inside onVoiceCallAccepted event');
    const callerSocket = this.sessions.getUserSocket(payload.caller.id);
    // const conversation = await this.conversationService.isCreated(
    //   payload.caller.id,
    //   socket.user.id,
    // );
    // if (!conversation) return console.log('No conversation found');
    // if (callerSocket) {
    //   console.log('Emitting onVoiceCallAccepted event');
    //   const callPayload = { ...payload, conversation, acceptor: socket.user };
    //   callerSocket.emit(WebsocketEvents.VOICE_CALL_ACCEPTED, callPayload);
    //   socket.emit(WebsocketEvents.VOICE_CALL_ACCEPTED, callPayload);
    // }
  }

  @SubscribeMessage(WebsocketEvents.VOICE_CALL_HANG_UP)
  async handleVoiceCallHangUp(
    @MessageBody() { caller, receiver }: CallHangUpPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('inside onVoiceCallHangUp event');
    if (socket.user.id === caller.id) {
      const receiverSocket = this.sessions.getUserSocket(receiver.id);
      socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
      return (
        receiverSocket &&
        receiverSocket.emit(WebsocketEvents.VOICE_CALL_HANG_UP)
      );
    }
    socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
    const callerSocket = this.sessions.getUserSocket(caller.id);
    callerSocket && callerSocket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
  }

  @SubscribeMessage(WebsocketEvents.VOICE_CALL_REJECTED)
  async handleVoiceCallRejected(
    @MessageBody() data,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('inside onVoiceCallRejected event');
    const receiver = socket.user;
    const callerSocket = this.sessions.getUserSocket(data.caller.id);
    callerSocket &&
      callerSocket.emit(WebsocketEvents.VOICE_CALL_REJECTED, { receiver });
    socket.emit(WebsocketEvents.VOICE_CALL_REJECTED, { receiver });
  }
}
