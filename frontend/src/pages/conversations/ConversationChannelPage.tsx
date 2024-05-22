import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessagePanel } from '../../components/messages/MessagePanel';
import { SocketContext } from '../../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../../utils/styles';
import { AppDispatch } from '../../store';
import { fetchMessagesThunk } from '../../store/Messages/messageThunk';
import { toast } from 'react-toastify';
import { updateToken, typingText } from '../../utils/api';

export const ConversationChannelPage = () => {
  const { id } = useParams();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);

  useEffect(() => {
    const conversationId = id!;
    dispatch(fetchMessagesThunk(conversationId));
  }, [id]);

  useEffect(() => {
    const conversationId = id!;
    socket.emit('onConversationJoin', { conversationId });
    socket.on('userJoin', () => {
      console.log('userJoin');
    });
    socket.on('userLeave', () => {
      console.log('userLeave');
    });
    socket.on('onTypingStart', () => {
      console.log('onTypingStart: User has started typing...');
      setIsRecipientTyping(true);
    });
    socket.on('onTypingStop', () => {
      console.log('onTypingStop: User has stopped typing...');
      setIsRecipientTyping(false);
    });
    // socket.on('onMessageUpdate', (message) => {
    //   console.log('onMessageUpdate received');
    //   console.log(message);
    //   dispatch(editMessage(message));
    // });

    return () => {
      socket.emit('onConversationLeave', { conversationId });
      socket.off('userJoin');
      socket.off('userLeave');
      socket.off('onTypingStart');
      socket.off('onTypingStop');
      // socket.off('onMessageUpdate');
    };
  }, [id]);

  const sendTypingStatus = () => {
    updateToken()
    if (isTyping) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          console.log('User stopped typing');
          setIsTyping(false);
          typingText(id!, false );
        }, 2000)
      );
    } else {
      setIsTyping(true);
      typingText(id!, true );
    }
  };

  return (
    <ConversationChannelPageStyle>
      <MessagePanel
        sendTypingStatus={sendTypingStatus}
        isRecipientTyping={isRecipientTyping}
      ></MessagePanel>
    </ConversationChannelPageStyle>
  );
};