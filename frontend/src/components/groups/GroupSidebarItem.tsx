import { useNavigate, useParams } from 'react-router-dom';
import { ConversationSidebarItemStyle } from '../../utils/styles';
import { ContextMenuEvent, Conversation } from '../../utils/types';
import { PeopleGroup } from 'akar-icons';
import { IconCountNewMessages, Time } from '../../utils/styles';//TagName
import { formatDistanceToNow } from 'date-fns';

import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectConversationMessage } from '../../store/Messages/messageSlice';
import { useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';

type Props = {
    group: Conversation;
    onContextMenu: (event: ContextMenuEvent, group: Conversation) => void;
};

export const GroupSidebarItem: React.FC<Props> = ({ group, onContextMenu }) => {
    const { id } = useParams();
    const MAX_TITLE_LENGTH = 14;
    const MESSAGE_LENGTH_MAX = 14;
    const navigate = useNavigate();

    const user = useContext(AuthContext).user!;
    const conversationMessages = useSelector((state: RootState) =>
        selectConversationMessage(state, group?._id!)
    );

    const getTransformedTitle = () => {
        return group.nameGroup && group.nameGroup.length > MAX_TITLE_LENGTH
            ? group.nameGroup.slice(0, MAX_TITLE_LENGTH).concat('...')
            : group.nameGroup;
    };

    const timeHandler = () => {
        const { lastMessageId } = group;
        const time = lastMessageId?.createdAt
        if(time)
            return formatDistanceToNow(new Date(time), { addSuffix: true })
        return null
    }

    const lastMessageContent = () => {
        const { lastMessageId } = group;
        if (lastMessageId && lastMessageId.isdeleted) {
            const content = lastMessageId.senderId?.name + ": Deleted a message"
            return content?.length >= MESSAGE_LENGTH_MAX
                ? content?.slice(0, MESSAGE_LENGTH_MAX).concat('...')
                : content;
        }
        if (lastMessageId && lastMessageId.content && lastMessageId.img && lastMessageId.img?.length == 0) {
            const content: string = (lastMessageId.senderId?.name + ": " + lastMessageId.content).split(' ').map((word) => {
                if (word.startsWith('@')) {
                    const name = word.split('_')[0];
                    return name +" ";
                } else {
                    return word+" ";
                }
            }).join('')
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
        const lastMessages = conversationMessages?.messages?.slice(0,6);
        let count = 0

        lastMessages && lastMessages.forEach((message: any) => {
            if(!message.seen.some((u: any) => u._id === user._id)) count++
        })
        
        return count
    }

    return (
        <ConversationSidebarItemStyle
            onClick={() => navigate(`/conversations/${group._id}`)}
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
            <div>
                <Time>{timeHandler()}</Time>
                {countNewMessages() > 0 && (
                    <span className="title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IconCountNewMessages>{countNewMessages() > 5 ? '5+' : countNewMessages()}</IconCountNewMessages></span>
                )}
                
                {/* <TagName> @ </TagName> */}
            </div>
        </ConversationSidebarItemStyle>
    );
};