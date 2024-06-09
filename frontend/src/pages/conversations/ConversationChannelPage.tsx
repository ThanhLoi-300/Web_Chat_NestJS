import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessagePanel } from '../../components/messages/MessagePanel';
import { SocketContext } from '../../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../../utils/styles';
import { AppDispatch, RootState } from '../../store';
import { fetchMessagesThunk } from '../../store/Messages/messageThunk';
import { AuthContext } from '../../utils/context/AuthContext';
import { selectConversationById, updateConversation, memberLeaveGroup } from '../../store/conversationsSlice';
import { updateSeenMessage } from '../../utils/api';
import { UpdateMessageSeen } from '../../utils/types';
import { deleteMessage, updateMessageSeen } from '../../store/Messages/messageSlice'
import { toggleCloseSidebar } from '../../store/groupRecipientsSidebarSlice';
import { ConversationInfor } from '../../components/conversations/ConversationInfor';

export const ConversationChannelPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [showInfor, setShowInfor] = useState(true);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [textTyping, setTextTyping] = useState('');

  // const showSidebar = useSelector(
  //   (state: RootState) => state.groupSidebar.showSidebar
  // );

  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, id!)
  );

  useEffect(() => {
    const conversationId = id!;
    dispatch(fetchMessagesThunk(conversationId));
  }, [id]);

  useEffect(() => {
    const conversationId = id!;
    socket.emit('onConversationJoin', { conversationId });
    socket.on('onTypingStart', (payload) => {
      console.log('onTypingStart: User has started typing...');
      if (payload.userId !== user?._id) {
        setIsRecipientTyping(true);
        setTextTyping(payload.text);
      }
    });
    socket.on('onTypingStop', () => {
      console.log('onTypingStop: User has stopped typing...');
      setIsRecipientTyping(false);
      setTextTyping('');
    });

    socket.on('onUpdateSeenMessage', (payload: UpdateMessageSeen) => {
      console.log('onUpdateSeenMessage: ');
      dispatch(updateMessageSeen(payload));
    });
    socket.on('deleteMessage', (message) => {
      dispatch(deleteMessage(message));
      const c = useSelector((state: RootState) =>
        selectConversationById(state, message.conversationId!)
      );
      if (c && c.lastMessageId && c.lastMessageId._id === message._id) {
        c.lastMessageId = message;
        dispatch(updateConversation(c));
      }
    });

    socket.on('memberLeaveGroup', (payload) => {
      dispatch(memberLeaveGroup(payload));
    });

    return () => {
      socket.emit('onConversationLeave', { conversationId });
      socket.off('onTypingStart');
      socket.off('onTypingStop');
      socket.off('onUpdateSeenMessage');
      socket.off('memberLeaveGroup');
    };
  }, [id]);

  useEffect(() => {
    if (conversation?.lastMessageId?.seen.filter((u: any) => u._id === user?._id).length === 0) {
      console.log('updateSeenMessage');
      updateSeenMessage(conversation.lastMessageId?._id!, conversation._id!);
      socket.emit("updateSeenMessage", { conversationId: conversation._id, messageId: conversation.lastMessageId?._id, user: user });
    }
    if (conversation && conversation.type == 'private') dispatch(toggleCloseSidebar())
  }, [conversation, id!]);

  const sendTypingStatus = () => {
    if (isTyping) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          console.log('User stopped typing');
          setIsTyping(false);
          socket.emit('onTypingStop', { typing: false, conversationId: id });
        }, 2000)
      );
    } else {
      setIsTyping(true);
      socket.emit('onTypingStart', { typing: true, conversationId: id, text: user!.name + ' is typing....', userId: user!._id });
    }
  };

  return (
    <>
      {/* {showEditGroupModal && <EditGroupModal />} */}
      <ConversationChannelPageStyle>
        <MessagePanel
          sendTypingStatus={sendTypingStatus}
          isRecipientTyping={isRecipientTyping}
          textTyping={textTyping}
          setShowInfor={setShowInfor}
          showInfor={showInfor}
        ></MessagePanel>
      </ConversationChannelPageStyle>
      {/* {showSidebar && <GroupRecipientsSidebar />} */}
      {showInfor && <ConversationInfor conversation={conversation!} setShowInfor={setShowInfor} />}
    </>
  );
};