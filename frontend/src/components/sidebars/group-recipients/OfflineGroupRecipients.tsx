import { Crown } from 'akar-icons';
import { FC } from 'react';
import { GroupRecipientSidebarItem } from '../../../utils/styles';
import { Conversation, User } from '../../../utils/types';
import { UserAvatar } from '../../users/UserAvatar';

type Props = {
    onlineUsers: User[];
    group?: Conversation;
    onUserContextMenu: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        user: User
    ) => void;
};

export const OfflineGroupRecipients: FC<Props> = ({
    onlineUsers,
    group,
    onUserContextMenu,
}) => (
    <>
        {group?.member
            .filter(
                (user) => !onlineUsers.find((onlineUser) => onlineUser._id === user._id)
            )
            .map((user) => (
                <GroupRecipientSidebarItem
                    online={false}
                    onClick={(e) => onUserContextMenu(e, user)}
                >
                    <div className="left">
                        <UserAvatar user={user} />
                        <span>{user.name}</span>
                    </div>
                    {user._id === group?.owner._id && <Crown color="#ffbf00" />}
                </GroupRecipientSidebarItem>
            ))}
    </>
);