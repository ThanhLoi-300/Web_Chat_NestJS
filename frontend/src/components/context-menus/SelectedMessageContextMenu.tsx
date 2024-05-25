import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { deleteGroupMessageThunk } from '../../store/groupMessagesSlice';
import {
    setIsEditing,
    setMessageBeingEdited,
} from '../../store/messageContainerSlice';
import { deleteMessageThunk } from '../../store/Messages/messageThunk';
import { AuthContext } from '../../utils/context/AuthContext';
import { ContextMenu, ContextMenuItem } from '../../utils/styles';
import { SocketContext } from '../../utils/context/SocketContext';

export const SelectedMessageContextMenu = () => {
    const { id: routeId } = useParams();
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);
    const { selectedMessage: message, points } = useSelector(
        (state: RootState) => state.messageContainer
    );

    const deleteMessage = () => {
        const id = routeId!;
        if (!message) return
        dispatch(deleteMessageThunk({ id, messageId: message!._id }))
        
        const updatedMessage = {
            ...message,
            isdeleted: true,
        };
        socket.emit('onMessageDelete', updatedMessage)
    };

    return (
        <>
            {
                message?.senderId._id === user?._id && (
                    <ContextMenu top={points.y} left={points.x}>
                        <ContextMenuItem onClick={deleteMessage}>Delete</ContextMenuItem>
                    </ContextMenu>
                )
            }
        </>
    );
};