import { useContext, useState, useEffect } from 'react';
import { FaPhoneAlt, FaVideo, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { initiateCallState } from '../../store/call/callSlice';
import { selectConversationById } from '../../store/conversationsSlice';
import { SenderEvents } from '../../utils/constants';
import { AuthContext } from '../../utils/context/AuthContext';
import { SocketContext } from '../../utils/context/SocketContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import {
    MessagePanelHeaderIcons,
    MessagePanelHeaderStyle,
    UserAvatarAndName,
} from '../../utils/styles';
import { CallInitiatePayload, CallType } from '../../utils/types';
import { UserAvatar } from '../users/UserAvatar';
import { UpdatePresenceStatusModal } from '../modals/UpdatePresenceStatusModal';
import { CreateFriendRequestModal } from '../modals/CreateFriendRequestModal';


export const MessagePanelConversationHeader = () => {
    const user = useContext(AuthContext).user!;
    const { id } = useParams();
    const socket = useContext(SocketContext);
    const [checkOnline, setCheckOnline] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalContact, setShowModalContact] = useState(false);
    const [showModalPresence, setShowModalPresence] = useState(false);

    const dispatch = useDispatch();
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

    const friends = useSelector(
        (state: RootState) => state.friends.friends
    );

    const recipient = getRecipientFromConversation(conversation, user)!;
    const isFriend = friends.some((u) => u._id === recipient._id)

    useEffect(() => {
        socket.emit('getOnlineUsers', { idUser: recipient._id });
        const interval = setInterval(() => {
            socket.emit('getOnlineUsers', { idUser: recipient._id });
        }, 1000);
        socket.on('onlineUsersReceived', (payload) => {
            console.log('received onlineUsersReceived event');
            // console.log(payload.result);
            setCheckOnline(payload.result);
        });
        return () => {
            console.log('Clearing Interval for GroupRecipientsSidebar');
            clearInterval(interval);
            socket.off('onlineUsersReceived');
        };
    }, [conversation]);

    const buildCallPayloadParams = (
        stream: MediaStream,
        type: CallType
    ): CallInitiatePayload | undefined =>
        conversation && {
            localStream: stream,
            caller: user!,
            receiver: recipient!,
            isCalling: true,
            activeConversationId: conversation._id!,
            callType: type,
        };

    const videoCallUser = async () => {
        if (!recipient) return console.log('Recipient undefined');
        socket.emit('onVideoCallInitiate', {
            conversationId: conversation!._id,
            recipientId: recipient._id,
        });
        const constraints = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const payload = buildCallPayloadParams(stream, 'video');
        if (!payload) throw new Error('Video Call Payload is undefined.');
        dispatch(initiateCallState(payload));
    };

    const voiceCallUser = async () => {
        if (!recipient) return console.log('Recipient undefined');
        socket.emit(SenderEvents.VOICE_CALL_INITIATE, {
            conversationId: conversation!._id,
            recipientId: recipient._id,
        });
        const constraints = { video: false, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const payload = buildCallPayloadParams(stream, 'audio');
        if (!payload) throw new Error('Voice Call Payload is undefined.');
        dispatch(initiateCallState(payload));
    };

    return (
        <MessagePanelHeaderStyle>
            {showModalPresence && <UpdatePresenceStatusModal setShowModal={setShowModalPresence} />}
            {showModal && <CreateFriendRequestModal setShowModal={setShowModal} friend={recipient} />}
            <UserAvatarAndName>
                <UserAvatar user={recipient} />
                <div>
                    <span>{recipient?.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: 5,marginTop: 5, height: 10, width: 10, backgroundColor: checkOnline ? 'blue' : "gray", borderRadius: '50%' }}></div>
                        <span>{checkOnline ? "Online" : "Offline"}</span>
                    </div>
                </div>
            </UserAvatarAndName>
            <MessagePanelHeaderIcons>
                {!isFriend && (<button style={{ padding: '6px 12px', borderRadius: '10px', cursor: 'pointer' }} onClick={() => setShowModal(true)}>Add friend</button>)}
                <FaPhoneAlt size={24} cursor="pointer" onClick={voiceCallUser} />
                <FaVideo size={30} cursor="pointer" onClick={videoCallUser} />
                {
                    showModalContact ? <FaToggleOn cursor="pointer" size={36} onClick={()=> setShowModalContact(false) } />
                        : <FaToggleOff cursor="pointer" size={36} onClick={() => setShowModalContact(true)} />
                }
            </MessagePanelHeaderIcons>
        </MessagePanelHeaderStyle>
    );
};