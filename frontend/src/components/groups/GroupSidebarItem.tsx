import { useNavigate, useParams } from 'react-router-dom';
import { ConversationSidebarItemStyle } from '../../utils/styles';
import { ContextMenuEvent, Conversation } from '../../utils/types';
import { PeopleGroup } from 'akar-icons';

import styles from './index.module.scss';

type Props = {
    group: Conversation;
    onContextMenu: (event: ContextMenuEvent, group: Conversation) => void;
};

export const GroupSidebarItem: React.FC<Props> = ({ group, onContextMenu }) => {
    const { id } = useParams();
    const MAX_TITLE_LENGTH = 18;
    const MESSAGE_LENGTH_MAX = 18;
    const navigate = useNavigate();

    const getTransformedTitle = () => {
        return group.nameGroup && group.nameGroup.length > MAX_TITLE_LENGTH
            ? group.nameGroup.slice(0, MAX_TITLE_LENGTH).concat('...')
            : group.nameGroup;
    };

    const lastMessageContent = () => {
        const { lastMessageId } = group;
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
        <ConversationSidebarItemStyle
            onClick={() => navigate(`/vite-deploy/conversations/${group._id}`)}
            onContextMenu={(e) => onContextMenu(e, group)}
            selected={id! === group._id}
        >
            {group.imgGroup ? (
                <img
                    src={group.imgGroup}
                    alt="avatar"
                    className={styles.groupAvatar}
                />
            ) : (
                <div className={styles.defaultGroupAvatar}>
                    <PeopleGroup size={28} />
                </div>
            )}
            <div>
                <span className="title">{getTransformedTitle()}</span>
                <span className={styles.groupLastMessage}>
                    {lastMessageContent()}
                </span>
            </div>
        </ConversationSidebarItemStyle>
    );
};