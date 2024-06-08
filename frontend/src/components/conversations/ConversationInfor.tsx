import { useEffect, useRef, useState, useContext, FC, Dispatch, SetStateAction, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
    GroupRecipientsSidebarHeader,
    GroupRecipientsSidebarStyle,
    UserContactInforStyle,
    UserContactItemStyle
} from '../../utils/styles';
import { SocketContext } from '../../utils/context/SocketContext';
import { Conversation } from '../../utils/types';
import { AuthContext } from '../../utils/context/AuthContext';
import { getRecipientFromConversation } from '../../utils/helpers';
import { UserAvatar } from '../users/UserAvatar';
import { PeopleGroup } from 'akar-icons';
import styles from '../groups/index.module.scss';
import { DropdownMenu } from '../context-menus/DropdownMenu';

type Props = {
    conversation: Conversation;
    setShowInfor: Dispatch<SetStateAction<boolean>>;
};

export const ConversationInfor: FC<Props> = ({ conversation, setShowInfor }) => {
    const socket = useContext(SocketContext);
    const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const [commonGroup, setCommonGroup] = useState<Conversation[]>([]);
    const user = useContext(AuthContext).user!;
    const { conversations } = useSelector((state: RootState) => state.conversation);

    useEffect(() => {
        const handleResize = (e: UIEvent) => setShowInfor(false);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const recipient: any = getRecipientFromConversation(conversation, user)!;

    const totalGroupTogether = useMemo(() => {
        if (conversation?.type === 'private') {
            const a: Conversation[] = conversations.filter((c: Conversation)=> c.type === 'group')
            let array: Conversation[] = []
            a.forEach((c: Conversation) => {
                const user = c.member.filter((m: any) => m._id === recipient?._id)
                if (user.length > 0) {
                    array.push(c)
                }
            })
            setCommonGroup(array)
            return array.length
        }
        return 0
    }, [conversation, conversations, recipient])

    return (
        <GroupRecipientsSidebarStyle>
            <GroupRecipientsSidebarHeader>
                <span>Infor</span>
            </GroupRecipientsSidebarHeader>
            <UserContactInforStyle>
                {
                    conversation?.type === 'private' ? (
                        <>
                            <UserAvatar user={recipient} />
                            <div>{recipient.name}</div>
                        </>
                    ) : (
                        <>
                            {
                                conversation?.imgGroup ? (
                                    <>
                                        <img
                                            src={conversation?.imgGroup}
                                            alt="avatar"
                                            className={styles.groupAvatar}
                                        />
                                        <div>{conversation?.nameGroup}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.defaultGroupAvatar}>
                                            <PeopleGroup size={28} />
                                        </div>
                                        <div>{conversation?.nameGroup}</div>
                                    </>
                                )}
                        </>)

                }
            </UserContactInforStyle>
            {
                conversation?.type === 'private' && <DropdownMenu text={"Common groups: " + totalGroupTogether} listGroup={commonGroup}/>
            }
            <DropdownMenu text={"Images"} />
            {
                conversation?.type === 'group' && <DropdownMenu text={"Members: "} />
            }

        </GroupRecipientsSidebarStyle>
    );
};
