import { useNavigate, useParams } from 'react-router-dom';
import { CDN_URL } from '../../utils/constants';
import { ConversationSidebarItemStyle } from '../../utils/styles';
import { ContextMenuEvent, Conversation, Group } from '../../utils/types';
import { PeopleGroup } from 'akar-icons';

import styles from './index.module.scss';

type Props = {
    group: Conversation;
    onContextMenu: (event: ContextMenuEvent, group: Conversation) => void;
};

export const GroupSidebarItem: React.FC<Props> = ({ group, onContextMenu }) => {
    const { id } = useParams();
    const MAX_TITLE_LENGTH = 20;
    const MESSAGE_LENGTH_MAX = 10;
    const navigate = useNavigate();

    const getTransformedTitle = () => {
        if (!group.nameGroup) {
            const usersToString = group.member
                .map((user) => user.name)
                .join(', ');
            return usersToString.length > MAX_TITLE_LENGTH
                ? usersToString.slice(0, MAX_TITLE_LENGTH).concat('...')
                : usersToString;
        }
        return group.nameGroup.length > MAX_TITLE_LENGTH
            ? group.nameGroup.slice(0, MAX_TITLE_LENGTH).concat('...')
            : group.nameGroup;
    };

    return (
        <ConversationSidebarItemStyle
            onClick={() => navigate(`/groups/${group._id}`)}
            onContextMenu={(e) => onContextMenu(e, group)}
            selected={id! === group._id}
        >
            {group.imgGroup ? (
                <img
                    src={CDN_URL.BASE.concat(group.imgGroup)}
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
                    {group.lastMessageId?.content}
                </span>
            </div>
        </ConversationSidebarItemStyle>
    );
};