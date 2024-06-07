import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessagePanel } from '../../components/messages/MessagePanel';
import { SocketContext } from '../../utils/context/SocketContext';
import { ConversationChannelPageStyle } from '../../utils/styles';
import { AppDispatch, RootState } from '../../store';
import { GroupRecipientsSidebar } from '../../components/sidebars/group-recipients/GroupRecipientsSidebar';
//import { EditGroupModal } from '../../components/modals/EditGroupModal';

export const GroupChannelPage = () => {
    const { id } = useParams();

    const socket = useContext(SocketContext);
    const dispatch = useDispatch<AppDispatch>();
    const [isRecipientTyping, setIsRecipientTyping] = useState(false);

    const { showEditGroupModal } = useSelector(
        (state: RootState) => state.groups
    );
    const showSidebar = useSelector(
        (state: RootState) => state.groupSidebar.showSidebar
    );

    useEffect(() => {
        const groupId = id!;
        console.log(groupId);
        socket.emit('onGroupJoin', { groupId });
        return () => {
            socket.emit('onGroupLeave', { groupId });
        };
    }, [id]);

    const sendTypingStatus = () => { };

    return (
        <>
            {/* {showEditGroupModal && <EditGroupModal />} */}
            <ConversationChannelPageStyle>
                <MessagePanel
                    sendTypingStatus={sendTypingStatus}
                    isRecipientTyping={isRecipientTyping}
                ></MessagePanel>
            </ConversationChannelPageStyle>
            {showSidebar && <GroupRecipientsSidebar />}
        </>
    );
};