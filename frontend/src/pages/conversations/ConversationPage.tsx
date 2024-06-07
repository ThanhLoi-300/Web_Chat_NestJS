import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import ConversationPanel from '../../components/conversations/ConversationPanel';
import ConversationSidebar from '../../components/conversations/ConversationSidebar';
import { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import {
    addConversation,
    fetchConversationsThunk,
    selectConversationById,
    updateConversation,
    deleteMember, deleteConversation, transferOwner,
    addMemberToConversation,
    updateGroupDetail
} from '../../store/conversationsSlice';
import { addMessage, deleteMessage } from '../../store/Messages/messageSlice';
import { Conversation, MessageEventPayload } from '../../utils/types';
import { AuthContext } from '../../utils/context/AuthContext';
import { SocketContext } from '../../utils/context/SocketContext';
import { toast } from 'react-toastify';

export const ConversationPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const dispatch: any = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

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
            dispatch(deleteMessage(payload));
        });
        socket.on('onDeleteMember', (payload) => {
            console.log('onDeleteMember: ' + JSON.stringify(payload));
            if (id! === payload.groupId && payload.userId !== user?._id) {
                toast.warning('A member has been kicked');
            } 
            if (payload.userId === user?._id) {
                dispatch(deleteConversation(payload.groupId));
                toast.warning('You have been kicked from the group');
                navigate(`/conversations`);
            }
            dispatch(deleteMember(payload));
        });

        socket.on('onTransferOwner', (payload) => {
            console.log('onTransferOwner: ' + JSON.stringify(payload));
            if (id! === payload.groupId && payload.user._id !== user?._id) {
                toast.warning('Leader has been transfered');
            }
            if (id! === payload.groupId && payload.user._id === user?._id) {
                toast.warning('You have been transferred the ownership');
            }
            dispatch(transferOwner(payload));
        });

        socket.on('updateGroupDetails', (payload) => {
            console.log('updateGroupDetails: ' + JSON.stringify(payload));
            dispatch(updateGroupDetail(payload));
        });
    
        return () => {
            socket.off('connected');
            socket.off('onMessage');
            socket.off('onConversation');
            socket.off('onMessageDelete');
            socket.off('onDeleteMember');
            socket.off('onTransferOwner');
        };
    }, [id]);

    useEffect(() => {
        socket.on(
            'addMemberToConversation',
            (conversation: Conversation) => {
                console.log('Received addMemberToConversation');
                const list = conversation.member.map((u) => u._id)
                if (list.includes(user!._id)) {
                    console.log('Received addMemberToConversation: yes')
                    dispatch(addMemberToConversation(conversation));
                }
            }
        );

        return () => {
            socket.off('addMemberToConversation');
        };
    }, []);

    return (
        <>
            {showSidebar && <ConversationSidebar />}
            {!id && !showSidebar && <ConversationSidebar />}
            {!id && showSidebar && <ConversationPanel />}
            <Outlet />
        </>
    );
};