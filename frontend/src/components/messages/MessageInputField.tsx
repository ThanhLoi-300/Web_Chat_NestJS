import { Dispatch, FC, SetStateAction, useState } from 'react';
import { CharacterLimit, MessageInputContainer } from '../../utils/styles';
import { MessageTextField } from '../inputs/MessageTextField';
import { FaceVeryHappy } from 'akar-icons';
import styles from './index.module.scss';
import { MessageAttachmentActionIcon } from './MessageAttachmentActionIcon';

type Props = {
    content: string;
    setContent: Dispatch<SetStateAction<string>>;
    placeholderName: string;
    sendMessage: () => void;
    sendTypingStatus: () => void;
};

export const MessageInputField: FC<Props> = ({
    content,
    placeholderName,
    setContent,
    sendMessage,
    sendTypingStatus,
}) => {
    const ICON_SIZE = 36;
    const [isMultiLine, setIsMultiLine] = useState(false);

    return (
        <>
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
        </>
    );
};