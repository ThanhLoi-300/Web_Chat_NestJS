import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessagePanel } from '../../components/messages/MessagePanel';
import { SocketContext } from '../../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../../utils/styles';
import { AppDispatch } from '../../store';
import { fetchMessagesThunk } from '../../store/Messages/messageThunk';
import { editMessage } from '../../store/Messages/messageSlice';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import { updateToken, typingText } from '../../utils/api';

export const ConversationChannelPage = () => {
  const { id } = useParams();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);

  const pusher: Pusher = new Pusher('e9de4cb87ed812e6153c', {
    cluster: 'ap1',
  });

  useEffect(() => {
    const conversationId = parseInt(id!);
    dispatch(fetchMessagesThunk(conversationId));
  }, [id]);

  useEffect(() => {
    const channel = pusher.subscribe(id!);
    channel.bind('onTypingStart', () => {
      toast.success('onTypingStart: User has started typing...');
      setIsRecipientTyping(true);
    });
    channel.bind('onTypingStop', () => {
      toast.error('onTypingStop: User has stopped typing...');
      setIsRecipientTyping(false);
    });
    // channel.bind('onMessageUpdate', (message) => {
    //   console.log('onMessageUpdate received');
    //   console.log(message);
    //   dispatch(editMessage(message));
    // });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
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