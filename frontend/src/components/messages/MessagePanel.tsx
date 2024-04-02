import { AxiosError } from 'axios';
import { FC, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { selectConversationById } from '../../store/conversationsSlice';
import { selectGroupById } from '../../store/groupSlice';
import { removeAllAttachments } from '../../store/message-panel/messagePanelSlice';
import {
    addSystemMessage,
    clearAllMessages,
} from '../../store/system-messages/systemMessagesSlice';
import { createMessage } from '../../utils/api';
import { AuthContext } from '../../utils/context/AuthContext';
import { getRecipientFromConversation } from '../../utils/helpers';
// import { useToast } from '../../utils/hooks/useToast';
import {
    MessagePanelBody,
    MessagePanelFooter,
    MessagePanelStyle,
    MessageTypingStatus,
} from '../../utils/styles';
import { MessagePanelHeader } from './MessagePanelHeader';
import { MessageAttachmentContainer } from './attachments/MessageAttachmentContainer';
import { MessageContainer } from './MessageContainer';
import { MessageInputField } from './MessageInputField';
import { uploadFile, uploadFiles } from '../../utils/uploadFile';
import { CreateMessageParams1 } from '../../utils/types';

type Props = {
    sendTypingStatus: () => void;
    isRecipientTyping: boolean;
};

export const MessagePanel: FC<Props> = ({
    sendTypingStatus,
    isRecipientTyping,
}) => {
    // const toastId = 'rateLimitToast';
    const dispatch = useDispatch();
    const { messageCounter } = useSelector(
        (state: RootState) => state.systemMessages
    );
    const [content, setContent] = useState('');
    const { id: routeId } = useParams();
    const { user } = useContext(AuthContext);

    // const { error } = useToast({ theme: 'dark' });
    const { attachments } = useSelector((state: RootState) => state.messagePanel);
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, parseInt(routeId!))
    );
    const group = useSelector((state: RootState) =>
        selectGroupById(state, parseInt(routeId!))
    );
    const selectedType = useSelector(
        (state: RootState) => state.selectedConversationType.type
    );

    const recipient = getRecipientFromConversation(conversation, user);

    useEffect(() => {
        return () => {
            dispatch(clearAllMessages());
            dispatch(removeAllAttachments());
        };
    }, []);

    const sendMessage = async () => {
        const trimmedContent = content.trim();
        if (!routeId) return;
        if (!trimmedContent && !attachments.length) return;
        const fb: string[] = await uploadFiles(attachments.map(attachment => attachment.file))

        const data: CreateMessageParams1 = {
            id: Number(routeId),
            content: trimmedContent,
            attachments: fb
        }
        try {
            await createMessage(routeId, selectedType, data);
            setContent('');
            dispatch(removeAllAttachments());
            dispatch(clearAllMessages());
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response?.status === 429) {
                // error('You are rate limited', { toastId });
                dispatch(
                    addSystemMessage({
                        id: messageCounter,
                        level: 'error',
                        content: 'You are being rate limited. Slow down.',
                    })
                );
            } else if (axiosError.response?.status === 404) {
                dispatch(
                    addSystemMessage({
                        id: messageCounter,
                        level: 'error',
                        content:
                            'The recipient is not in your friends list or they may have blocked you.',
                    })
                );
            }
        }
    };

    return (
        <>
            <MessagePanelStyle>
                <MessagePanelHeader/>
                <MessagePanelBody>
                    <MessageContainer />
                </MessagePanelBody>
                <MessagePanelFooter>
                    {attachments.length > 0 && <MessageAttachmentContainer />}
                    <MessageInputField
                        content={content}
                        setContent={setContent}
                        sendMessage={sendMessage}
                        sendTypingStatus={sendTypingStatus}
                        placeholderName={
                            selectedType === 'group'
                                ? group?.title || 'Group'
                                : recipient?.name || 'user'
                        }
                    />
                    <MessageTypingStatus>
                        {isRecipientTyping ? `${recipient?.name} is typing...` : ''}
                    </MessageTypingStatus>
                </MessagePanelFooter>
            </MessagePanelStyle>
        </>
    );
};