import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MessageItemContent } from '../../utils/styles';
import { GroupMessageType, MessageType } from '../../utils/types';
import { MessageItemAttachmentContainer } from './attachments/MessageItemAttachmentContainer';
import { EditMessageContainer } from './EditMessageContainer';

type Props = {
    message: MessageType | GroupMessageType;
    onEditMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    padding: string;
    owner: boolean;
};

export const MessageItemContainerBody: FC<Props> = ({
    message,
    onEditMessageChange,
    padding,
    owner
}) => {
    const { isEditingMessage, messageBeingEdited } = useSelector(
        (state: RootState) => state.messageContainer
    );

    return (
        <>
            {isEditingMessage && message.id === messageBeingEdited?.id ? (
                <MessageItemContent padding={padding} owner={owner}>
                    <EditMessageContainer onEditMessageChange={onEditMessageChange} />
                </MessageItemContent>
            ) : (
                <div style={{ marginRight: owner ? 0 : 'auto', marginLeft: owner ? 'auto' : 0 }}>
                    <MessageItemContent padding={padding} owner={owner}>
                        {message.content || null}
                    </MessageItemContent>
                    {message.attachments?.length === 0 ? null :
                        (
                            <MessageItemContent padding={padding} owner={owner}>
                                <MessageItemAttachmentContainer message={message} />
                            </MessageItemContent>
                        )
                    }
                </div >
            )}
        </>
    );
};