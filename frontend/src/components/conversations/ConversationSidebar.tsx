import { ChatAdd } from 'akar-icons';
import { useEffect, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
    setContextMenuLocation,
    setSelectedGroup,
    toggleContextMenu,
} from '../../store/groupSlice';
import { SidebarContainerStyle } from '../../utils/styles';
import {
    ConversationSearchbar,
    SidebarHeader,
    SidebarStyle,
    ScrollableContainer,
} from '../../utils/styles';
import { ContextMenuEvent, Conversation, Group } from '../../utils/types';
import { GroupSidebarContextMenu } from '../context-menus/GroupSidebarContextMenu';
import { ConversationSidebarItem } from '../conversations/ConversationSidebarItem';
import { GroupSidebarItem } from '../groups/GroupSidebarItem';
import { CreateConversationModal } from '../modals/CreateConversationModal';
import { CreateGroupModal } from '../modals/CreateGroupModal';
import { getConversations } from '../../utils/api';

const ConversationSidebar = () => {
    const [showModal, setShowModal] = useState(false);
    const [showModalGroup, setShowModalGroup] = useState(false);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const conversations = useSelector(
        (state: RootState) => state.conversation.conversations
    );

    // useEffect(() => {
    //     // setConversations([])
    //     console.log('state.conversations' + JSON.stringify(conversations))
    // }, [conversations])

    const showGroupContextMenu = useSelector(
        (state: RootState) => state.groups.showGroupContextMenu
    );

    // const groups = useSelector((state: RootState) => state.groups.groups);

    // const conversationType = useSelector(
    //     (state: RootState) => state.selectedConversationType.type
    // );

    const searchConversation = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearch(value);

        // try {
        //     const response = await fetch(`/api/conversations?q=${value}`);
        //     const data = await response.json();
        //     // Xử lý dữ liệu trả về từ API ở đây
        //     console.log(data);
        // } catch (error) {
        //     console.error('Error searching conversations:', error);
        // }
    };

    const onGroupContextMenu = (event: ContextMenuEvent, group: Conversation) => {
        event.preventDefault();
        console.log('Group Context Menu');
        console.log(group);
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: event.pageX, y: event.pageY }));
        dispatch(setSelectedGroup(group));
    };

    useEffect(() => {
        const handleResize = () => dispatch(toggleContextMenu(false));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    return (
        <>
            {showModal && (
                <CreateConversationModal setShowModal={setShowModal} />
            )}
            {showModalGroup && (
                <CreateGroupModal setShowModal={setShowModalGroup} />
            )}
            <SidebarStyle>
                <SidebarHeader>
                    <ConversationSearchbar placeholder="Search for Conversations" onChange={searchConversation} />
                    <ChatAdd
                        size={30}
                        cursor="pointer"
                        onClick={() => setShowModal(true)}
                    />
                    <AiOutlineUsergroupAdd
                        size={30}
                        cursor="pointer"
                        onClick={() => setShowModalGroup(true)}
                    />
                </SidebarHeader>
                <ScrollableContainer>
                    <SidebarContainerStyle>
                        {conversations.map((conversation: Conversation) => (
                            conversation.type === 'private' ?
                                (
                                    <ConversationSidebarItem
                                        key={conversation._id}
                                        conversation={conversation}
                                    />) : (<GroupSidebarItem
                                        key={conversation._id}
                                        group={conversation}
                                        onContextMenu={onGroupContextMenu}
                                    />)))}
                        {showGroupContextMenu && <GroupSidebarContextMenu />}
                    </SidebarContainerStyle>
                </ScrollableContainer>
                <footer></footer>
            </SidebarStyle>
        </>
    )
}

export default ConversationSidebar
