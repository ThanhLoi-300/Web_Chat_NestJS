import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../../utils/context/AuthContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import { Conversation } from '../../utils/types';
import defaultAvatar from '../../__assets__/default_avatar.jpg';

import styles from './index.module.scss';
import { toggleCloseSidebar } from '../../store/groupRecipientsSidebarSlice';
import {
    IconCountNewMessages, Time, ConversationSidebarItemDetails,
    ConversationSidebarItemStyle,
} from '../../utils/styles';//TagName
import { formatDistanceToNow } from 'date-fns';
import { RootState } from '../../store';
import { selectConversationMessage } from '../../store/Messages/messageSlice';

type Props = {
    conversation: Conversation;
};

export const ConversationSidebarItem: React.FC<Props> = ({ conversation }) => {
    const MESSAGE_LENGTH_MAX = 18;
    const MAX_NAME_LENGTH = 18;
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const recipient = getRecipientFromConversation(conversation, user)!;

    const conversationMessages = useSelector((state: RootState) =>
        selectConversationMessage(state, conversation?._id!)
    );

    const getTransformedTitle = () => {
        return recipient.name.length > MAX_NAME_LENGTH
            ? recipient.name.slice(0, MAX_NAME_LENGTH).concat('...')
            : recipient.name;
    };

    const lastMessageContent = () => {
        const { lastMessageId } = conversation;
        if (lastMessageId && lastMessageId.isdeleted) {
            const content = lastMessageId.senderId?.name + ": Deleted a message"
            return content?.length >= MESSAGE_LENGTH_MAX
                ? content?.slice(0, MESSAGE_LENGTH_MAX).concat('...')
                : content;
        }
        if (lastMessageId && lastMessageId.content && lastMessageId.img && lastMessageId.img?.length == 0) {
            const content = lastMessageId.senderId?.name + ": " + lastMessageId.content
            return content?.length >= MESSAGE_LENGTH_MAX
                ? content?.slice(0, MESSAGE_LENGTH_MAX).concat('...')
                : content;
        } else if (lastMessageId && lastMessageId.img && lastMessageId.img?.length > 0) {
            const content = lastMessageId.senderId?.name + ": sent photo"
            return content?.length >= MESSAGE_LENGTH_MAX
                ? content?.slice(0, MESSAGE_LENGTH_MAX).concat('...')
                : content;
        }
        return null;
    };

    const countNewMessages = () => {
        const lastMessages = conversationMessages?.messages?.slice(0, 6);
        let count = 0

        lastMessages && lastMessages.forEach((message: any) => {
            if (!message.seen.some((u: any) => u._id === user!._id)) count++
        })

        return count
    }

    const timeHandler = () => {
        const { lastMessageId } = conversation;
        const time = lastMessageId?.createdAt
        if (time)
            return formatDistanceToNow(new Date(time), { addSuffix: true })
        return null
    }

    return (
        <>
            <ConversationSidebarItemStyle
                onClick={() => {
                    navigate(`/conversations/${conversation._id}`)
                    dispatch(toggleCloseSidebar())
                }}
                selected={id! === conversation._id}
            >
                <img
                    src={recipient?.avatar ? recipient?.avatar
                        : defaultAvatar
                    }
                    alt="avatar"
                    className={styles.conversationAvatar}
                />
                <ConversationSidebarItemDetails>
                    <span className="conversationName">
                        {getTransformedTitle()}
                    </span>
                    <span className="conversationLastMessage">
                        {lastMessageContent()}
                    </span>
                </ConversationSidebarItemDetails>
                <div>
                    <Time>{timeHandler()}</Time>
                    {countNewMessages() > 0 && (
                        <span className="title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IconCountNewMessages>{countNewMessages() > 5 ? '5+' : countNewMessages()}</IconCountNewMessages></span>
                    )}

                    {/* <TagName> @ </TagName> */}
                </div>
            </ConversationSidebarItemStyle>
        </>
    );
};