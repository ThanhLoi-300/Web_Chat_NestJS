import { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import {
    leaveGroupThunk,
    toggleContextMenu,
    leaveGroup
} from '../../store/conversationsSlice';

import {
    setShowEditGroupModal, setSelectedGroup
} from '../../store/conversationsSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import { ContextMenu, ContextMenuItem } from '../../utils/styles';
import { IoMdExit } from 'react-icons/io';
import { Edit } from 'akar-icons';
import { SocketContext } from '../../utils/context/SocketContext';
import { toast } from 'react-toastify';

export const GroupSidebarContextMenu: FC = () => {
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
    const points = useSelector((state: RootState) => state.conversation.points);

    const conversation = useSelector((state: RootState) =>
        state.conversation.selectedGroupContextMenu
    );

    const LeaveGroup = () => {
        if (!conversation) return;
        if (conversation?.owner?._id === user?._id) toast.error("You are owner in this group")
        else 
            dispatch(leaveGroupThunk(conversation?._id!)).finally(() => {
                socket.emit('memberLeaveGroup', { conversationId: conversation?._id!, userId: user!._id });
                dispatch(toggleContextMenu(false))
                dispatch(leaveGroup(conversation?._id!))
            });
    };

    return (
        <ContextMenu top={points.y} left={points.x}>
            <ContextMenuItem onClick={LeaveGroup}>
                <IoMdExit size={20} color="#ff0000" />
                <span style={{ color: '#ff0000' }}>Leave Group</span>
            </ContextMenuItem>
            {user?._id === conversation?.owner?._id && (
                <ContextMenuItem onClick={() => {
                    dispatch(setShowEditGroupModal(true))
                    dispatch(setSelectedGroup(conversation!))
                }}>
                    <Edit size={20} color="#fff" />
                    <span style={{ color: '#fff' }}>Edit Group</span>
                </ContextMenuItem>
            )}
            {/* <ContextMenuItem>
                <IoIosArchive size={20} color="#fff" />
                <span style={{ color: '#fff' }}>Archive Group</span>
            </ContextMenuItem> */}
        </ContextMenu>
    );
};