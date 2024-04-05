import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import ConversationPanel from '../../components/conversations/ConversationPanel';
import ConversationSidebar from '../../components/conversations/ConversationSidebar';
import { AppDispatch } from '../../store';
import {
    addConversation,
    fetchConversationsThunk,
    updateConversation,
} from '../../store/conversationsSlice';
import { addMessage, deleteMessage } from '../../store/Messages/messageSlice';
import { updateType } from '../../store/selectedSlice';
import { Conversation, DeleteMessageResponse, MessageEventPayload } from '../../utils/types';
import Pusher from 'pusher-js';
import { AuthContext } from '../../utils/context/AuthContext';
import { toast } from 'react-toastify';

export const ConversationPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const dispatch = useDispatch<AppDispatch>();

    const pusher = new Pusher('e9de4cb87ed812e6153c', {
        cluster: 'ap1',
    });

    useEffect(() => {
        const handleResize = () => setShowSidebar(window.innerWidth > 800);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        dispatch(updateType('private'));
        dispatch(fetchConversationsThunk());
    }, []);

    useEffect(() => {
        if (user) { 
            const channel = pusher.subscribe(user.id.toString());
            channel.bind('onConversation', (payload: any) => {
                console.log('Received onConversation Event');
                console.log(payload);
                dispatch(addConversation(payload));
            });

            channel.bind('onMessage', (payload: MessageEventPayload) => {
                console.log('Message Received');
                const { conversation, message } = payload;
                console.log(conversation, message);
                dispatch(addMessage(payload));
                dispatch(updateConversation(conversation));
            });

            channel.bind('onMessageDelete', (payload: DeleteMessageResponse) => {
                console.log('Message Deleted');
                console.log(payload);
                dispatch(deleteMessage(payload));
            });
            
            return () => {
                channel.unbind_all();
                channel.unsubscribe();
                pusher.disconnect();
            };
        }
    }, [id]);

    return (
        <>
            {showSidebar && <ConversationSidebar />}
            {!id && !showSidebar && <ConversationSidebar />}
            {!id && showSidebar && <ConversationPanel />}
            <Outlet />
        </>
    );
};