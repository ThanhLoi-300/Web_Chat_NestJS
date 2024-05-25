import {
    GroupRecipientSidebarItemContainer,
    GroupRecipientsSidebarHeader,
    GroupRecipientsSidebarStyle,
} from '../../../utils/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { selectConversationById } from '../../../store/conversationsSlice';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../utils/context/SocketContext';
import { User } from '../../../utils/types';
import {
    setContextMenuLocation,
    setSelectedUser,
    toggleContextMenu,
} from '../../../store/groupRecipientsSidebarSlice';
import { SelectedParticipantContextMenu } from '../../context-menus/SelectedParticipantContextMenu';
import { OnlineGroupRecipients } from './OnlineGroupRecipients';

export const GroupRecipientsSidebar = () => {
    const { id: groupId } = useParams();

    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [offlineUsers, setOfflineUsers] = useState<User[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, groupId!)
    );
    const groupSidebarState = useSelector(
        (state: RootState) => state.groupSidebar
    );

    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        handleClick()
    }, [groupId]);

    useEffect(() => {
        socket.emit('getOnlineGroupUsers', { groupId });
        const interval = setInterval(() => {
            socket.emit('getOnlineGroupUsers', { groupId });
        }, 1000);
        socket.on('onlineGroupUsersReceived', (payload) => {
            setOnlineUsers(conversation?.member.filter((user: User) => payload.onlineUsers.includes(user._id))!);
            setOfflineUsers(conversation?.member.filter((user: User) => !payload.onlineUsers.includes(user._id))!);
        });
        return () => {
            console.log('Clearing Interval for GroupRecipientsSidebar');
            clearInterval(interval);
            socket.off('onlineGroupUsersReceived');
        };
    }, [conversation, groupId]);

    useEffect(() => {
        const handleResize = (e: UIEvent) => dispatch(toggleContextMenu(false));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onUserContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        user: User
    ) => {
        e.preventDefault();
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedUser(user));
    };

    return (
        <GroupRecipientsSidebarStyle>
            <GroupRecipientsSidebarHeader>
                <span>Participants</span>
            </GroupRecipientsSidebarHeader>
            <GroupRecipientSidebarItemContainer>
                <div>
                    <span>Online Users</span> {onlineUsers?.length} / {conversation?.member.length}
                    <OnlineGroupRecipients
                        users={onlineUsers}
                        group={conversation}
                        onUserContextMenu={onUserContextMenu}
                    />
                </div>

                <div>
                    <span>Offline Users</span> {offlineUsers?.length} / {conversation?.member.length}
                    <OnlineGroupRecipients
                        users={offlineUsers}
                        group={conversation}
                        onUserContextMenu={onUserContextMenu}
                    />
                </div>

                {groupSidebarState.showUserContextMenu && (
                    <SelectedParticipantContextMenu points={groupSidebarState.points} />
                )}
            </GroupRecipientSidebarItemContainer>
        </GroupRecipientsSidebarStyle>
    );
};