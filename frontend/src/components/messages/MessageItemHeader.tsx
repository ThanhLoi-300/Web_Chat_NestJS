import { formatRelative } from 'date-fns';
import { FC, useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { MessageItemHeaderContainer } from '../../utils/styles';
import { MessageType } from '../../utils/types';

type Props = {
    message: MessageType;
};

export const MessageItemHeader: FC<Props> = ({ message }) => {
    const { user } = useContext(AuthContext);
    return (
        <MessageItemHeaderContainer>
            <span
                className="authorName"
                style={{
                    color: user?._id === message.senderId._id ? '#989898' : '#5E8BFF',
                    display: user?._id === message.senderId._id ? 'none' : 'block'
                }}
            >
                {message.senderId.name}
            </span>
            <span className="time"
                style={{
                    display: 'flex',
                    justifyContent: user?._id === message.senderId._id ? 'flex-end' : 'flex-start',
                }}>
                {formatRelative(new Date(message.createdAt), new Date())}
            </span>
        </MessageItemHeaderContainer>
    );
};