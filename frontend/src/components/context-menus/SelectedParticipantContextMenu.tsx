import { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import {
    removeGroupRecipientThunk,
    updateGroupOwnerThunk,
} from '../../store/groupSlice';
selectConversationById
import {
    selectConversationById
} from '../../store/conversationsSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import { getUserContextMenuIcon, isGroupOwner } from '../../utils/helpers';
import { ContextMenu, ContextMenuItem } from '../../utils/styles';
import { UserContextMenuActionType } from '../../utils/types';
import { Person, PersonCross, Crown } from 'akar-icons';
import { SocketContext } from '../../utils/context/SocketContext';
import {
    toggleContextMenu,
} from '../../store/groupRecipientsSidebarSlice';

type Props = {
    points: { x: number; y: number };
};

type CustomIconProps = {
    type: UserContextMenuActionType;
};

export const CustomIcon: FC<CustomIconProps> = ({ type }) => {
    const { icon: MyIcon, color } = getUserContextMenuIcon(type);
    return <MyIcon size={20} color={color} />;
};

export const SelectedParticipantContextMenu: FC<Props> = ({ points }) => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const selectedUser = useSelector(
        (state: RootState) => state.groupSidebar.selectedUser
    );
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

    const socket = useContext(SocketContext);

    const kickUser = () => {
        console.log(`Kicking User: ${selectedUser?._id}`);
        console.log(selectedUser);
        if (!selectedUser) return;
        dispatch(
            removeGroupRecipientThunk({
                id: id!,
                userId: selectedUser._id,
            })
        );
        socket.emit('deleteMember', { groupId: id!, userId: selectedUser._id });
        dispatch(toggleContextMenu(false));
    };

    const transferGroupOwner = () => {
        console.log(`Transfering Group Owner to ${selectedUser?._id}`);
        if (!selectedUser) return;
        dispatch(
            updateGroupOwnerThunk({ id: id!, newOwnerId: selectedUser._id })
        );
        socket.emit('transferOwner', { groupId: id!, user: selectedUser });
        dispatch(toggleContextMenu(false));
    };

    const isOwner = isGroupOwner(user, conversation);

    return (
        <ContextMenu top={points.y} left={points.x}>
            <ContextMenuItem>
                <Person size={20} color="#7c7c7c" />
                <span style={{ color: '#7c7c7c' }}>Profile</span>
            </ContextMenuItem>
            {isOwner && user?._id !== selectedUser?._id && (
                <>
                    <ContextMenuItem onClick={kickUser}>
                        <PersonCross size={20} color="#ff0000" />
                        <span style={{ color: '#ff0000' }}>Kick User</span>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={transferGroupOwner}>
                        <Crown size={20} color="#FFB800" />
                        <span style={{ color: '#FFB800' }}>Transfer Owner</span>
                    </ContextMenuItem>
                </>
            )}
        </ContextMenu>
    );
};