import { useSelector, useDispatch } from 'react-redux';
import { FriendListContainer } from '../../utils/styles/friends';
import { FriendRequestItem } from './FriendRequestItem';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '../../store';
import { fetchFriendRequestThunk } from '../../store/friends/friendsThunk';

export const FriendRequestList = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(fetchFriendRequestThunk());
    }, [dispatch])
    const friendRequests = useSelector(
        (state: RootState) => state.friends.friendRequests
    );
    return (
        <FriendListContainer>
            {friendRequests.length === 0 && <div>No Friend Requests :</div>}
            {friendRequests.map((friendRequest) => (
                <FriendRequestItem
                    key={friendRequest._id}
                    friendRequest={friendRequest}
                />
            ))}
        </FriendListContainer>
    );
};