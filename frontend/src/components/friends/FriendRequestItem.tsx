import { FC, useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { FriendRequestItemContainer } from '../../utils/styles/friends';
import { FriendRequest, HandleFriendRequestAction } from '../../utils/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import {
    acceptFriendRequestThunk,
    cancelFriendRequestThunk,
    rejectFriendRequestThunk,
} from '../../store/friends/friendsThunk';
import { getFriendRequestDetails } from '../../utils/helpers';
import { FriendRequestDetails } from './friend-request/FriendRequestDetails';
import { FriendRequestIcons } from './friend-request/FriendRequestIcons';
import { SocketContext } from '../../utils/context/SocketContext';

type Props = {
    friendRequest: FriendRequest;
};
export const FriendRequestItem: FC<Props> = ({ friendRequest }) => {
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
    const friendRequestDetails = getFriendRequestDetails(friendRequest, user);

    const handleFriendRequest = (type?: HandleFriendRequestAction) => {
        const { _id } = friendRequest;
        switch (type) {
            case 'accept':
                dispatch(acceptFriendRequestThunk(_id));
                socket.emit('onFriendRequestAccepted', friendRequest)
                break
            case 'reject':
                dispatch(rejectFriendRequestThunk(_id));
                socket.emit('onFriendRequestRejected', friendRequest)
                break
            default:
                dispatch(cancelFriendRequestThunk(_id));
                socket.emit('onFriendRequestCancelled', friendRequest)
                break
        }
    };

    return (
        <FriendRequestItemContainer>
            <FriendRequestDetails details={friendRequestDetails} />
            <FriendRequestIcons
                details={friendRequestDetails}
                handleFriendRequest={handleFriendRequest}
            />
        </FriendRequestItemContainer>
    );
};