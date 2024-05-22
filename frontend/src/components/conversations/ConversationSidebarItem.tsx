import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

type Props = {
    conversation: Conversation;
};

export const ConversationSidebarItem: React.FC<Props> = ({ conversation }) => {
    const MESSAGE_LENGTH_MAX = 22;
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const recipient = getRecipientFromConversation(conversation, user);

    const lastMessageContent = () => {
        const { lastMessageId } = conversation;
        if (lastMessageId && lastMessageId.content && lastMessageId.img && lastMessageId.img?.length == 0) {
            const content = lastMessageId.senderId?.name+": " + lastMessageId.content
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

    const hasProfilePicture = () => recipient?.avatar;

    return (
        <>
            <ConversationSidebarItemStyle
                onClick={() => navigate(`/conversations/${conversation._id}`)}
                selected={id! === conversation._id}
            >
                <img
                    src={
                        hasProfilePicture()
                            ? CDN_URL.BASE.concat(recipient?.avatar!)
                            : defaultAvatar
                    }
                    alt="avatar"
                    className={styles.conversationAvatar}
                />
                <ConversationSidebarItemDetails>
                    <span className="conversationName">
                        {`${recipient?.name}`}
                    </span>
                    <span className="conversationLastMessage">
                        {lastMessageContent()}
                    </span>
                </ConversationSidebarItemDetails>
            </ConversationSidebarItemStyle>
        </>
    );
};