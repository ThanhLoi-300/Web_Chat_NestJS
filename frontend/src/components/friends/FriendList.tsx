import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../store';
import { FriendListContainer } from '../../utils/styles/friends';
import { FriendListItem } from './FriendListItem';
import { FriendContextMenu } from '../context-menus/FriendContextMenu';
import { ContextMenuEvent, User } from '../../utils/types';
import {
    setContextMenuLocation,
    setSelectedFriend,
    toggleContextMenu,
} from '../../store/friends/friendsSlice';
import { FC } from 'react';

type Props = {
    onlineUsers: User[],
    offlineUsers: User[]
}
export const FriendList: FC<Props> = ({ onlineUsers, offlineUsers }) => {
    const { showContextMenu, friends, onlineFriends, offlineFriends } = useSelector(
        (state: RootState) => state.friends
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const onContextMenu = (e: ContextMenuEvent, friend: User) => {
        e.preventDefault();
        console.log('Friend Context Menu');
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedFriend(friend));
    };

    return (
        <FriendListContainer>
            {onlineUsers?.length > 0 && <span>Online ({onlineUsers?.length})</span>}
            {onlineUsers?.map((friend) => (
                <FriendListItem
                    key={friend._id}
                    friend={friend}
                    onContextMenu={onContextMenu}
                    online={true}
                />
            ))}
            <span>Offline</span>
            {offlineUsers
                .map((friend) => (
                    <FriendListItem
                        key={friend._id}
                        friend={friend}
                        onContextMenu={onContextMenu}
                        online={false}
                    />
                ))}
            {showContextMenu && <FriendContextMenu />}
        </FriendListContainer>
    );
};