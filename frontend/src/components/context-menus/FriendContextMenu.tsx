import { useContext } from 'react';
import { MdPersonRemove, MdOutlineTextsms } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { toggleContextMenu, removeFriend } from '../../store/friends/friendsSlice';
import { removeFriendThunk } from '../../store/friends/friendsThunk';
import { checkConversationOrCreate } from '../../utils/api';
import { AuthContext } from '../../utils/context/AuthContext';
import { SocketContext } from '../../utils/context/SocketContext';
import { ContextMenu, ContextMenuItem } from '../../utils/styles';
import { createConversationThunk } from '../../store/conversationsSlice';
import { Conversation } from '../../utils/types';

export const FriendContextMenu = () => {
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { points, selectedFriendContextMenu } = useSelector(
        (state: RootState) => state.friends
    );
    const { friends } = useSelector(
        (state: RootState) => state.friends
    );
    const socket = useContext(SocketContext);

    const removeFriends = () => {
        if (!selectedFriendContextMenu) return;
        dispatch(toggleContextMenu(false));
        dispatch(removeFriend(selectedFriendContextMenu))
        dispatch(removeFriendThunk(selectedFriendContextMenu._id))
        socket.emit('getOnlineFriends', { friends: friends.map((f) => f._id) })
        socket.emit('onFriendRemoved', { user, id: selectedFriendContextMenu._id })
    };

    const sendMessage = () => {
        selectedFriendContextMenu &&
            checkConversationOrCreate(selectedFriendContextMenu._id)
                .then(({ data }) => {
                    console.log(data);
                    navigate(`/vite-deploy/conversations/${data._id}`);
                })
                .catch(() => {
                    const conversation: Conversation = {
                        type: 'private',
                        member: [selectedFriendContextMenu, user!]
                    }

                    return dispatch(
                        createConversationThunk(conversation!)
                    )
                        .unwrap()
                        .then(({ data }) => {
                            navigate(`/vite-deploy/conversations/${data._id}`);
                        })
                        .catch((err) => console.log(err));
                });
    };

    return (
        <ContextMenu top={points.y} left={points.x}>
            <ContextMenuItem onClick={removeFriends}>
                <MdPersonRemove size={20} color="#ff0000" />
                <span style={{ color: '#ff0000' }}>Remove Friend</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={sendMessage}>
                <MdOutlineTextsms size={20} color="#fff" />
                <span style={{ color: '#fff' }}>Message</span>
            </ContextMenuItem>
        </ContextMenu>
    );
};