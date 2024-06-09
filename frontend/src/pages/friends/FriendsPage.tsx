import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { FriendList } from '../../components/friends/FriendList';
import {
    removeFriend,
} from '../../store/friends/friendsSlice';
import { fetchFriendsThunk } from '../../store/friends/friendsThunk';
import { SocketContext } from '../../utils/context/SocketContext';
import { User } from '../../utils/types';
import { AppDispatch, RootState } from '../../store';

export const FriendsPage = () => {
    const friends = useSelector(
        (state: RootState) => state.friends.friends, shallowEqual
    );
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
    const [onlineUsers, setOnlineUsers] = useState<User[]>(friends);
    const [offlineUsers, setOfflineUsers] = useState<User[]>(friends);

    useEffect(() => {
        console.log("check friends: 1 "+ JSON.stringify(friends));
        dispatch(fetchFriendsThunk());
        console.log('fetching friends: '+ JSON.stringify(friends));
    }, [dispatch]);

    useEffect(() => {
        console.log("check friends: 2 " + JSON.stringify(friends));
        socket.emit('getOnlineFriends', {friends: friends.map((f) => f._id)});
        const interval = setInterval(() => {
            socket.emit('getOnlineFriends', { friends: friends.map((f) => f._id) });
        }, 2000);

        socket.on('getOnlineFriends', (list: string[]) => {
            console.log('received online friends ' + JSON.stringify(list));
            setOnlineUsers(friends.filter((user: User) => list.includes(user._id)));
            setOfflineUsers(friends.filter((user: User) => !list.includes(user._id)));
            console.log("setOnlineUsers"+JSON.stringify(onlineUsers))
        });

        socket.on('onFriendRemoved', (friend: User) => {
            console.log('onFriendRemoved');
            dispatch(removeFriend(friend));
            socket.emit('getOnlineFriends', { friends: friends.map((f) => f._id) });
        });

        return () => {
            console.log('clearing interval');
            clearInterval(interval);
            socket.off('getOnlineFriends');
            socket.off('onFriendRemoved');
        };
    }, []);

    return <FriendList onlineUsers={onlineUsers} offlineUsers={offlineUsers} />;
};