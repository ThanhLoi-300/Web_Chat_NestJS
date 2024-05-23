import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MessageItemContent } from '../../utils/styles';
import { MessageType } from '../../utils/types';
import { MessageItemAttachmentContainer } from './attachments/MessageItemAttachmentContainer';
import { EditMessageContainer } from './EditMessageContainer';

type Props = {
    message: MessageType;
    onEditMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    padding: string;
    owner: boolean;
    ml: boolean;
};

export const MessageItemContainerBody: FC<Props> = ({
    message,
    onEditMessageChange,
    padding,
    owner,
    ml
}) => {
    // const { isEditingMessage, messageBeingEdited } = useSelector(
    //     (state: RootState) => state.messageContainer
    // );

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* {isEditingMessage && message._id === messageBeingEdited?._id ? (
                <MessageItemContent padding={padding} owner={owner}>
                    <EditMessageContainer onEditMessageChange={onEditMessageChange} />
                </MessageItemContent>
            ) : ( */}
            <div>
                {message.content && (
                    <MessageItemContent padding={padding} owner={owner} ml={ml} img={false}>
                        {message.content}
                    </MessageItemContent>
                )}</div>
            <div>
                {message.img?.length === 0 ? null :
                    (
                        <MessageItemContent padding={padding} owner={owner} ml={ml} img={true}>
                            <MessageItemAttachmentContainer message={message} owner={owner} />
                        </MessageItemContent>
                    )
                }
            </div >
            {/* )} */}
        </div>
    );
};