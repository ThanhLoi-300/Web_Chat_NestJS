import { AxiosError } from 'axios';
import { FC, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { selectConversationById } from '../../store/conversationsSlice';
import styles from './index.module.scss';
import { removeAllAttachments } from '../../store/message-panel/messagePanelSlice';
import {
    addSystemMessage,
    clearAllMessages,
} from '../../store/system-messages/systemMessagesSlice';
import { createMessage } from '../../utils/api';
import { AuthContext } from '../../utils/context/AuthContext';
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
import Picker, { EmojiStyle, PickerProps } from 'emoji-picker-react';
import { FaTimes } from 'react-icons/fa';
import { PickerComponent } from 'stipop-react-sdk'
import { TbSticker2 } from "react-icons/tb";

type Props = {
    sendTypingStatus: () => void;
    isRecipientTyping: boolean;
    textTyping: string;
    setShowInfor: Dispatch<SetStateAction<boolean>>;
    showInfor: boolean;
};

export const MessagePanel: FC<Props> = ({
    sendTypingStatus,
    isRecipientTyping,
    textTyping,
    setShowInfor,
    showInfor
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

    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [isStickerVisible, setIsStickerVisible] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState<string>('');
    console.log(selectedSticker)

    const handleEmojiClick: PickerProps['onEmojiClick'] = (emojiData) => {
        setContent((preText) => preText + emojiData.emoji)
    };

    const handleSticker = async (url: string) => {
        setSelectedSticker(url)
        const data: CreateMessageParams = {
            id: routeId!,
            content: "",
            attachments: [url],
            user: user!
        }
        await createMessage(routeId!, data);
    }

    return (
        <>
            <MessagePanelStyle>
                <MessagePanelHeader type={conversation?.type!} setShowInfor={setShowInfor} showInfor={showInfor} />
                <MessagePanelBody>
                    <MessageContainer />
                </MessagePanelBody>

                <div style={{ position: 'fixed', top: '50px', right: '30px' }}>
                    {
                        isStickerVisible && (<PickerComponent
                            params={{
                                apikey: '9df560dd7e4344d0fa6c3b55781a4f72',
                                userId: '1234',
                            }}
                            stickerClick={(url: any) => handleSticker(url.url)}
                        />)
                    }

                    {isPickerVisible && (
                        <>
                            <FaTimes onClick={() => setIsPickerVisible(false)} className={styles.icon} />
                            <Picker
                                onEmojiClick={handleEmojiClick}
                                emojiStyle={EmojiStyle.APPLE}
                            />
                        </>
                    )}
                </div>
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
                        <TbSticker2 className={styles.icon} size={ICON_SIZE} onClick={() => setIsStickerVisible(!isStickerVisible)} />
                        <FaceVeryHappy className={styles.icon} size={ICON_SIZE} onClick={() => setIsPickerVisible(!isPickerVisible)} />
                    </MessageInputContainer>
                    <MessageTypingStatus>
                        {isRecipientTyping && textTyping}
                    </MessageTypingStatus>
                </MessagePanelFooter>
            </MessagePanelStyle>
        </>
    );
};