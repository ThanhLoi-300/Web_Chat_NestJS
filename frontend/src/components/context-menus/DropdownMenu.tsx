import { FC, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { PeopleGroup } from 'akar-icons';
import {
    DropdownStyle,
    DropdownContentStyle,
    ImageDropdownStyle
} from '../../utils/styles';
import { Conversation } from '../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { selectConversationMessage } from '../../store/Messages/messageSlice';
import {
    selectConversationById
} from '../../store/conversationsSlice';
import { OnlineGroupRecipients } from '../sidebars/group-recipients/OnlineGroupRecipients';

import { SocketContext } from '../../utils/context/SocketContext';
import { User } from '../../utils/types';
import {
    setContextMenuLocation,
    setSelectedUser,
    toggleContextMenu,
} from '../../store/groupRecipientsSidebarSlice';
import { SelectedParticipantContextMenu } from '../context-menus/SelectedParticipantContextMenu';
import styles from '../messages/index.module.scss';
import { MdClose } from 'react-icons/md';
import { useKeydown } from '../../utils/hooks';
import { OverlayStyle } from '../../utils/styles';

type Props = {
    text: string;
    listGroup?: Conversation[];
    setShowModalProfile: Dispatch<SetStateAction<boolean>>;
};

export const DropdownMenu: FC<Props> = ({ text, listGroup, setShowModalProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { id } = useParams();

    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [offlineUsers, setOfflineUsers] = useState<User[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);

    const groupSidebarState = useSelector(
        (state: RootState) => state.groupSidebar
    );

    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

    useEffect(() => {
        const handleClick = () => dispatch(toggleContextMenu(false));
        handleClick()
    }, [id]);

    useEffect(() => {
        socket.emit('getOnlineGroupUsers', { id });
        const interval = setInterval(() => {
            socket.emit('getOnlineGroupUsers', { id });
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
    }, [conversation, id]);

    const onUserContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        user: User
    ) => {
        e.preventDefault();
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedUser(user));
    };

    const conversationMessages = useSelector((state: RootState) =>
        selectConversationMessage(state, id!)
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const listImage = () => {
        const array: string[] = []
        conversationMessages?.messages?.forEach((message) => {
            if (!message.isdeleted && message.img) array.push(...message.img.filter((i)=> !i.includes(".gif")))
        })
        return array
    }

    const [showOverlay, setShowOverlay] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const onClick = (key: string) => {
        setShowOverlay(true);
        setImageUrl(key);
    };

    const handleKeydown = (e: KeyboardEvent) =>
        e.key === 'Escape' && setShowOverlay(false);
    useKeydown(handleKeydown);

    return (
        <DropdownStyle>
            <span onClick={toggleDropdown}>
                {text}
            </span>
            {isOpen && (
                <DropdownContentStyle>
                    {
                        text === "Images" && listImage()?.map((image, index) => <ImageDropdownStyle key={index} src={image} onClick={() => onClick(image)} />)
                    }
                    {
                        listGroup && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {listGroup?.map((c) => (
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {
                                            c.imgGroup ? <img src={c.imgGroup} style={{ width: '35px', height: '35px', borderRadius: '50%' }} /> : <PeopleGroup size={35} />
                                        }
                                        <div>{c.nameGroup}</div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    {
                        text === "Members: " && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}> 
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
                                    <SelectedParticipantContextMenu points={groupSidebarState.points} setShowModalProfile={setShowModalProfile} />
                                )}
                            </div>
                        )
                    }
                    {showOverlay && (
                        <OverlayStyle style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                            <MdClose
                                className={styles.closeIcon}
                                size={50}
                                onClick={() => setShowOverlay(false)}
                            />
                            <img src={imageUrl} alt="overlay" style={{ maxHeight: '90%' }} />
                        </OverlayStyle>
                    )}
                </DropdownContentStyle>
            )}
        </DropdownStyle>
    );
};