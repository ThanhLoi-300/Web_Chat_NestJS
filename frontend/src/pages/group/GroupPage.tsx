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
import { updateType } from '../../store/selectedSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import {
  Group,
  AddGroupUserMessagePayload,
  GroupMessageEventPayload,
  RemoveGroupUserMessagePayload,
  UpdateGroupAction,
  GroupParticipantLeftPayload,
} from '../../utils/types';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
export const GroupPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const pusher = new Pusher('00806514f90cf476dcd8', {
    cluster: 'ap1',
  });

  useEffect(() => {
    dispatch(updateType('group'));
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
    if (id) {
      console.log(id)
      const channel = pusher.subscribe(id);
      channel.bind('createGroupMessage', (payload: GroupMessageEventPayload) => {
        const { group } = payload;
        console.log("púher")
        dispatch(addGroupMessage(payload));
        dispatch(updateGroup({ type: UpdateGroupAction.NEW_MESSAGE, group }));
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };

    }

    // socket.on('onGroupCreate', (payload: Group) => {
    //   console.log('Group Created...');
    //   dispatch(addGroup(payload));
    // });

    // socket.on('onGroupUserAdd', (payload: AddGroupUserMessagePayload) => {
    //   console.log('onGroupUserAdd');
    //   console.log(payload);
    //   dispatch(addGroup(payload.group));
    // });

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
    //     if (userId === user?.id) {
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