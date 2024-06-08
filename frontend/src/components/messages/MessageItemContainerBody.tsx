import { FC } from 'react';
import { MessageItemContent } from '../../utils/styles';
import { MessageType, User } from '../../utils/types';
import { MessageItemAttachmentContainer } from './attachments/MessageItemAttachmentContainer';
import { UserAvatar } from '../users/UserAvatar';
import { useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';

type Props = {
    message: MessageType;
    padding: string;
    owner: boolean;
    ml: boolean;
    isLast: boolean;
};

export const MessageItemContainerBody: FC<Props> = ({
    message,
    padding,
    owner,
    ml,
    isLast,
}) => {
    const { user } = useContext(AuthContext);

    const filterSeenMessage = () => {
        if (message.seen.length > 10) {
            const seenArray = [...message.seen].splice(0, 5);
            return (
                seenArray.map((seen: User) => seen._id !== user?._id && (
                    <UserAvatar key={seen._id} user={seen} size={20} />
                ))
            );
        }
        return message.seen.map((seen) => seen._id !== user?._id &&
            <UserAvatar key={seen._id} user={seen} size={20} />
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                {!message.isdeleted ? (
                    <MessageItemContent padding={padding} owner={owner} ml={ml} img={false}>
                        <span style={{ width: '100%', display: 'flex', justifyContent: owner ? 'flex-end' : "flex-start"}}>{message.content}</span>
                        {
                            message.img?.length > 0 && <MessageItemAttachmentContainer message={message} owner={owner} />
                        }
                    </MessageItemContent>
                ) : (
                    <MessageItemContent padding={padding} owner={owner} ml={ml} img={false}>
                        <p style={{ color: '#494646', fontSize: '12px' }}>This message has been deleted</p>
                    </MessageItemContent>
                )}
            </div>

            {
                isLast && owner && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                        {
                            filterSeenMessage()
                        }{
                            message.seen.length > 10 && (<div style={{ marginLeft: '5px' }}>5+</div>)
                        }
                    </div>
                )
            }
        </div>
    );
};