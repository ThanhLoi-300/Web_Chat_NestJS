import { useState, useContext } from 'react';
import {
    UserSidebarFooter,
    UserSidebarHeader,
    UserSidebarScrollableContainer,
    UserSidebarStyle,
} from '../../utils/styles';
import { userSidebarItems } from '../../utils/constants';
import { UserSidebarItem } from './items/UserSidebarItem';
import { AuthContext } from '../../utils/context/AuthContext';
import { UpdatePresenceStatusModal } from '../modals/UpdatePresenceStatusModal';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { UserAvatar } from '../users/UserAvatar';
import { updateToken, logoutUser as logoutUserAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../utils/context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { EditGroupModal } from '../../components/modals/EditGroupModal';

export const UserSidebar = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const { showEditGroupModal } = useSelector(
        (state: RootState) => state.conversation
    );

    const logoutUser = () => {
        updateToken()
        logoutUserAPI()
        localStorage.removeItem('accessToken');
        navigate('/vite-deploy/login', { replace: true })
        socket.disconnect()
    };

    return (
        <>
            {showModal && <UpdatePresenceStatusModal setShowModal={setShowModal} />}
            {showEditGroupModal && <EditGroupModal />}
            <UserSidebarStyle>
                <UserSidebarHeader>
                    <UserAvatar user={user!} onClick={() => setShowModal(true)} />
                </UserSidebarHeader>
                <UserSidebarScrollableContainer>
                    {userSidebarItems.map((item) => (
                        <UserSidebarItem key={item.id} item={item} />
                    ))}
                </UserSidebarScrollableContainer>

                <UserSidebarFooter>
                    <RiLogoutCircleLine size={30} onClick={() => logoutUser()} />
                </UserSidebarFooter>
            </UserSidebarStyle>
        </>
    );
};