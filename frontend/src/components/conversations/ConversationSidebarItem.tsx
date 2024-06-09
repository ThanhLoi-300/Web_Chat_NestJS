import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CDN_URL } from '../../utils/constants';
import { AuthContext } from '../../utils/context/AuthContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import {
    ConversationSidebarItemDetails,
    ConversationSidebarItemStyle,
} from '../../utils/styles';
import { Conversation } from '../../utils/types';
import defaultAvatar from '../../__assets__/default_avatar.jpg';

import styles from './index.module.scss';
import { toggleCloseSidebar } from '../../store/groupRecipientsSidebarSlice';

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

    return (
        <>
            <ConversationSidebarItemStyle
                onClick={() => {
                    navigate(`/vite-deploy/conversations/${conversation._id}`)
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
            </ConversationSidebarItemStyle>
        </>
    );
};