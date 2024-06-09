import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import ConversationPanel from '../../components/conversations/ConversationPanel';
import ConversationSidebar from '../../components/conversations/ConversationSidebar';
import { AppDispatch } from '../../store';
import {
  fetchGroupsThunk,
} from '../../store/groupSlice';
import { SocketContext } from '../../utils/context/SocketContext';
export const GroupPage = () => {
  const { id } = useParams();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
  const dispatch: any = useDispatch<AppDispatch>();

  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(fetchGroupsThunk());
  }, []);

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth > 800);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // socket.on(
    //   'addMemberToConversation',
    //   (conversation: Conversation) => {
    //     console.log('Received addMemberToConversation');
    //     dispatch(addMemberToConversation(conversation));
    //   }
    // );

    // socket.on('onGroupRemoved', (payload: RemoveGroupUserMessagePayload) => {
    //   dispatch(removeGroup(payload.group));
    //   if (id && parseInt(id) === payload.group.id) {
    //     console.log('Navigating User to /groups');
    //     navigate('/groups');
    //   }
    // });

    // socket.on(
    //   'onGroupParticipantLeft',
    //   ({ group, userId }: GroupParticipantLeftPayload) => {
    //     console.log('onGroupParticipantLeft received');
    //     dispatch(updateGroup({ group }));
    //     if (userId === user?._id) {
    //       console.log('payload.userId matches user.id...');
    //       dispatch(removeGroup(group));
    //       navigate('/groups');
    //     }
    //   }
    // );

    return () => {
      socket.off('onGroupReceivedNewUser');
      socket.off('onGroupRemoved');
      socket.off('onGroupParticipantLeft');
    };
  }, [id]);

  return (
    <>
      {showSidebar && <ConversationSidebar />}
      {!id && !showSidebar && <ConversationSidebar />}
      {!id && showSidebar && <ConversationPanel />}
      <Outlet />
    </>
  );
};