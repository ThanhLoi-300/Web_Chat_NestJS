import { useContext, useState } from 'react';
import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
// import { initiateCallState } from '../../../store/call/callSlice';
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


export const MessagePanelConversationHeader = () => {
    const user = useContext(AuthContext).user!;
    const { id } = useParams();
    const socket = useContext(SocketContext);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

    const recipient = getRecipientFromConversation(conversation, user);
    // const buildCallPayloadParams = (
    //     stream: MediaStream,
    //     type: CallType
    // ): CallInitiatePayload | undefined =>
    //     conversation && {
    //         localStream: stream,
    //         caller: user,
    //         receiver: recipient!,
    //         isCalling: true,
    //         activeConversationId: conversation._id,
    //         callType: type,
    //     };

    const videoCallUser = async () => {
        if (!recipient) return console.log('Recipient undefined');
        socket.emit('onVideoCallInitiate', {
            conversationId: conversation!._id,
            recipientId: recipient._id,
        });
        const constraints = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // const payload = buildCallPayloadParams(stream, 'video');
        // if (!payload) throw new Error('Video Call Payload is undefined.');
        //dispatch(initiateCallState(payload));
    };

    const voiceCallUser = async () => {
        if (!recipient) return console.log('Recipient undefined');
        socket.emit(SenderEvents.VOICE_CALL_INITIATE, {
            conversationId: conversation!._id,
            recipientId: recipient._id,
        });
        const constraints = { video: false, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // const payload = buildCallPayloadParams(stream, 'audio');
        // if (!payload) throw new Error('Voice Call Payload is undefined.');
        //dispatch(initiateCallState(payload));
    };

    return (
        <MessagePanelHeaderStyle>
            {/* {showModal && <UpdatePresenceStatusModal setShowModal={setShowModal} />} */}
            <UserAvatarAndName>
                <UserAvatar user={user!} onClick={() => setShowModal(true)} />
                <div>
                    <span>{recipient?.name || 'User'}</span>
                    <div style={{ height: 10, width: 10, backgroundColor: 'blue', borderRadius: '50%' }}></div>
                </div>
            </UserAvatarAndName>
            <MessagePanelHeaderIcons>
                <FaPhoneAlt size={24} cursor="pointer" onClick={voiceCallUser} />
                <FaVideo size={30} cursor="pointer" onClick={videoCallUser} />
            </MessagePanelHeaderIcons>
        </MessagePanelHeaderStyle>
    );
};