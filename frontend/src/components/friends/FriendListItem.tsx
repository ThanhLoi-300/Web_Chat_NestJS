import { FC, useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { FriendListItemContainer } from '../../utils/styles/friends';
import { ContextMenuEvent, Friend, User } from '../../utils/types';
import { UserAvatar } from '../users/UserAvatar';

type Props = {
    friend: User;
    online: boolean;
    onContextMenu: (e: ContextMenuEvent, friend: User) => void;
};

export const FriendListItem: FC<Props> = ({
    friend,
    online,
    onContextMenu,
}) => {
    const { user } = useContext(AuthContext);

    // const friendUserInstance =
    //     user?._id === friend.sender._id ? friend.receiver : friend.sender;

    return (
        <FriendListItemContainer
            onContextMenu={(e) => onContextMenu(e, friend)}
            online={online}
        >
            <UserAvatar user={friend} />
            <div className="friendDetails">
                <span className="username">{friend.name}</span>
                {online && (
                    <span className="status">
                        {/* {friendUserInstance.presence?.statusMessage} */}
                    </span>
                )}
            </div>
        </FriendListItemContainer>
    );
};