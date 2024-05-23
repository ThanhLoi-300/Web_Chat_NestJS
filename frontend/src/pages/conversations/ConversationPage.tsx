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
import { Conversation, DeleteMessageResponse, MessageEventPayload } from '../../utils/types';
import { AuthContext } from '../../utils/context/AuthContext';
import { SocketContext } from '../../utils/context/SocketContext';

export const ConversationPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const dispatch = useDispatch<AppDispatch>();

    const socket = useContext(SocketContext);

    useEffect(() => {
        const handleResize = () => setShowSidebar(window.innerWidth > 800);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        dispatch(fetchConversationsThunk());
    }, []);

    useEffect(() => {
        socket.on('connected', () => {
            console.log('connected');
        });
        socket.on('onMessage', (payload: MessageEventPayload) => {
            console.log('Message Received');
            const { conversation, message } = payload;
            console.log(conversation, message);
            dispatch(addMessage(payload));
            dispatch(updateConversation(conversation));
        });
        socket.on('onConversation', (payload: Conversation) => {
            console.log('Received onConversation Event');
            console.log(payload);
            dispatch(addConversation(payload));
        });
        socket.on('onMessageDelete', (payload) => {
            console.log('Message Deleted');
            console.log(payload);
            dispatch(deleteMessage(payload));
        });
        return () => {
            socket.off('connected');
            socket.off('onMessage');
            socket.off('onConversation');
            socket.off('onMessageDelete');
        };
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