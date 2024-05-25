import { AxiosError } from 'axios';
import { FC, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { selectConversationById } from '../../store/conversationsSlice';
// import { selectGroupById } from '../../store/groupSlice';
import styles from './index.module.scss';
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
    MessageInputContainer,
    MessagePanelBody,
    MessagePanelFooter,
    MessagePanelStyle,
    MessageTypingStatus,
} from '../../utils/styles';
import { MessagePanelHeader } from './MessagePanelHeader';
import { MessageAttachmentContainer } from './attachments/MessageAttachmentContainer';
import { MessageContainer } from './MessageContainer';
import { uploadFiles } from '../../utils/uploadFile';
import { CreateMessageParams } from '../../utils/types';
import { FaceVeryHappy } from 'akar-icons';
import { MessageTextField } from '../inputs/MessageTextField';
import { MessageAttachmentActionIcon } from './MessageAttachmentActionIcon';

type Props = {
    sendTypingStatus: () => void;
    isRecipientTyping: boolean;
    textTyping: string;
};

export const MessagePanel: FC<Props> = ({
    sendTypingStatus,
    isRecipientTyping,
    textTyping,
}) => {
    const dispatch = useDispatch();
    const { messageCounter } = useSelector(
        (state: RootState) => state.systemMessages
    );
    const [content, setContent] = useState('');
    const { id: routeId } = useParams();
    const { user } = useContext(AuthContext);

    const ICON_SIZE = 36;
    const [isMultiLine, setIsMultiLine] = useState(false);
    const { attachments } = useSelector((state: RootState) => state.messagePanel);
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, routeId!)
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

        const data: CreateMessageParams = {
            id: routeId,
            content: trimmedContent,
            attachments: fb,
            user: user!
        }
        console.log("data: " + JSON.stringify(data))
        try {
            setContent('');
            dispatch(removeAllAttachments());
            dispatch(clearAllMessages());
            await createMessage(routeId, data);
        } catch (err) {
            console.log("err" + JSON.stringify(err))
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
                <MessagePanelHeader type={conversation?.type!} />
                <MessagePanelBody>
                    <MessageContainer />
                </MessagePanelBody>
                <MessagePanelFooter>
                    {attachments.length > 0 && <MessageAttachmentContainer />}
                    <MessageInputContainer isMultiLine={isMultiLine}>
                        <MessageAttachmentActionIcon />
                        <form onSubmit={sendMessage} className={styles.form}>
                            <MessageTextField
                                message={content}
                                setMessage={setContent}
                                setIsMultiLine={setIsMultiLine}
                                sendTypingStatus={sendTypingStatus}
                                sendMessage={sendMessage}
                            />
                        </form>
                        <FaceVeryHappy className={styles.icon} size={ICON_SIZE} />
                    </MessageInputContainer>
                    <MessageTypingStatus>
                        {isRecipientTyping && textTyping}
                    </MessageTypingStatus>
                </MessagePanelFooter>
            </MessagePanelStyle>
        </>
    );
};