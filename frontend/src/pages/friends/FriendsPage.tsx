import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FriendList } from '../../components/friends/FriendList';
import {
    removeFriend,
} from '../../store/friends/friendsSlice';
import { fetchFriendsThunk } from '../../store/friends/friendsThunk';
import { SocketContext } from '../../utils/context/SocketContext';
import { User } from '../../utils/types';
import { AppDispatch, RootState } from '../../store';
import { toast } from 'react-toastify';

export const FriendsPage = () => {
    const friends = useSelector(
        (state: RootState) => state.friends.friends
    );
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [offlineUsers, setOfflineUsers] = useState<User[]>([]);

    useEffect(() => {
        dispatch(fetchFriendsThunk());
    }, [dispatch]);

    useEffect(() => {
        socket.emit('getOnlineFriends', {friends: friends.map((f) => f._id)});
        const interval = setInterval(() => {
            socket.emit('getOnlineFriends', { friends: friends.map((f) => f._id) });
        }, 2000);

        socket.on('getOnlineFriends', (list: string[]) => {
            // console.log('received online friends ' + JSON.stringify(list));
            setOnlineUsers(friends.filter((user: User) => list.includes(user._id)));
            setOfflineUsers(friends.filter((user: User) => !list.includes(user._id)));
            // console.log("setOnlineUsers"+JSON.stringify(onlineUsers))
        });

        socket.on('onFriendRemoved', (friend: User) => {
            console.log('onFriendRemoved');
            toast.success('Friend removed');
            dispatch(removeFriend(friend));
            dispatch(fetchFriendsThunk());
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