import { FC } from 'react';
import { GroupRecipientSidebarItem } from '../../../utils/styles';
import { ContextMenuEvent, Conversation, User } from '../../../utils/types';
import { UserAvatar } from '../../users/UserAvatar';

type Props = {
    users: User[];
    group?: Conversation;
    onUserContextMenu: (e: ContextMenuEvent, user: User) => void;
};

export const OnlineGroupRecipients: FC<Props> = ({
    users,
    group,
    onUserContextMenu,
}) => {
    // const formatStatusMessage = ({ presence }: User) => {
    //     if (!presence || !presence.statusMessage) return null;
    //     const { statusMessage } = presence;
    //     return statusMessage.length > 30
    //         ? statusMessage.slice(0, 30).concat('...')
    //         : statusMessage;
    // };
console.log(group?.owner?._id)
    return (
        <>
            {users?.map((user) => (
                <GroupRecipientSidebarItem
                    online={true}
                    onClick={(e) => onUserContextMenu(e, user)}
                >
                    <div className="left">
                        <UserAvatar user={user} />
                        <div className="recipientDetails">
                            <span>{user.name}</span>
                            {/* <span className="status">{formatStatusMessage(user)}</span> */}
                        </div>
                    </div>
                    {/* {user._id === group?.owner?._id && <Crown color="#ffbf00" />} */}
                </GroupRecipientSidebarItem>
            ))}
        </>
    );
};