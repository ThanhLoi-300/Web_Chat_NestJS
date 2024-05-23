import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ConversationPanel from '../../components/conversations/ConversationPanel';
import ConversationSidebar from '../../components/conversations/ConversationSidebar';
import { AppDispatch } from '../../store';
import { addGroupMessage } from '../../store/groupMessagesSlice';
import {
  addGroup,
  fetchGroupsThunk,
  removeGroup,
  updateGroup,
} from '../../store/groupSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import {
  Group,
  AddGroupUserMessagePayload,
  GroupMessageEventPayload,
  RemoveGroupUserMessagePayload,
  UpdateGroupAction,
  GroupParticipantLeftPayload,
} from '../../utils/types';
import { SocketContext } from '../../utils/context/SocketContext';
export const GroupPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
  const dispatch: any = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
    // socket.on('onGroupMessage', (payload: GroupMessageEventPayload) => {
    //   console.log('Group Message Received');
    //   const { group } = payload;
    //   dispatch(addGroupMessage(payload));
    //   dispatch(updateGroup({ type: UpdateGroupAction.NEW_MESSAGE, group }));
    // });

    // socket.on('onGroupCreate', (payload: Group) => {
    //   console.log('Group Created...');
    //   dispatch(addGroup(payload));
    // });

    /**
     * Adds the group for the user being added
     * to the group.
     */
    // socket.on('onGroupUserAdd', (payload: AddGroupUserMessagePayload) => {
    //   console.log('onGroupUserAdd');
    //   console.log(payload);
    //   dispatch(addGroup(payload.group));
    // });

    /**
     * Update all other clients in the room
     * so that they can also see the participant
     */
    // socket.on(
    //   'onGroupReceivedNewUser',
    //   ({ group }: AddGroupUserMessagePayload) => {
    //     console.log('Received onGroupReceivedNewUser');
    //     dispatch(updateGroup({ group }));
    //   }
    // );

    // socket.on(
    //   'onGroupRecipientRemoved',
    //   ({ group }: RemoveGroupUserMessagePayload) => {
    //     console.log('onGroupRecipientRemoved');
    //     dispatch(updateGroup({ group }));
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

    // socket.on('onGroupOwnerUpdate', (group: Group) => {
    //   console.log('received onGroupOwnerUpdate');
    //   dispatch(updateGroup({ group }));
    // });

    return () => {
      socket.off('onGroupMessage');
      socket.off('onGroupCreate');
      socket.off('onGroupUserAdd');
      socket.off('onGroupReceivedNewUser');
      socket.off('onGroupRecipientRemoved');
      socket.off('onGroupRemoved');
      socket.off('onGroupParticipantLeft');
      socket.off('onGroupOwnerUpdate');
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