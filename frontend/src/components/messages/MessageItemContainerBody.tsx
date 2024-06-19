import { Dispatch, FC } from 'react';
import { useParams } from 'react-router-dom';
import { MessageItemContent } from '../../utils/styles';
import { MessageType, User } from '../../utils/types';
import { MessageItemAttachmentContainer } from './attachments/MessageItemAttachmentContainer';
import { UserAvatar } from '../users/UserAvatar';
import { useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { RootState, AppDispatch } from '../../store';
import { selectConversationById } from '../../store/conversationsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../store/groupRecipientsSidebarSlice';
import { toast } from 'react-toastify';
import { format } from 'date-fns';


type Props = {
    message: MessageType;
    padding: string;
    owner: boolean;
    ml: boolean;
    isLast: boolean;
    setShowModalProfile: Dispatch<React.SetStateAction<boolean>>;
};

export const MessageItemContainerBody: FC<Props> = ({
    message,
    padding,
    owner,
    ml,
    isLast,
    setShowModalProfile
}) => {
    const { user } = useContext(AuthContext);
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>();
    const conversation = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

    const filterSeenMessage = () => {
        if (message.seen.length > 10) {
            const seenArray = [...message.seen].splice(0, 5);
            return (
                seenArray.map((seen: User) => seen._id !== user?._id && (
                    <UserAvatar key={seen._id} user={seen} size={20} />
                ))
            );
        }
        return message.seen.map((seen) => seen._id !== user?._id &&
            <UserAvatar key={seen._id} user={seen} size={20} />
        )
    }

    const handleClickTagName = (idUser: string) => {
        if (idUser == 'All') return 
        const user = conversation?.member.filter((u: User) => u._id === idUser)[0];
        if (user) {
            dispatch(setSelectedUser(user));
            setShowModalProfile(true)
        }else toast.error('This user isn\'t in the conversation!');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                {!message.isdeleted ? (
                    <MessageItemContent padding={padding} owner={owner} ml={ml} img={false}>
                        <span style={{ width: '100%' }}>{message.content?.split(' ').map((word, index) => {
                            if (word.startsWith('@')) {
                                const name = word.split('_')[0];
                                const idUser = word.split('_')[1];
                                return (
                                    <span key={index} style={{ color: '#3ec8f7' }} onClick={() => handleClickTagName(idUser)}>
                                        {name}{' '}
                                    </span>
                                );
                            } else {
                                return (
                                    <span key={index}>
                                        {word}{' '}
                                    </span>
                                );
                            }
                        })}</span>
                        {
                            message.img?.length > 0 && <MessageItemAttachmentContainer message={message} owner={owner} />
                        }
                        <span style={{ fontSize: '12px', color: '#e2d3d3' }}>{format(new Date(message.createdAt), 'HH:mm')}</span>
                    </MessageItemContent>
                ) : (
                    <MessageItemContent padding={padding} owner={owner} ml={ml} img={false}>
                        <p style={{ color: '#494646', fontSize: '12px' }}>This message has been deleted</p>
                        <span style={{ fontSize: '12px', color: '#e2d3d3'}}>{format(new Date(message.createdAt), 'HH:mm')}</span>
                    </MessageItemContent>
                )}
            </div>

            {
                isLast && owner && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                        {
                            filterSeenMessage()
                        }{
                            message.seen.length > 10 && (<div style={{ marginLeft: '5px' }}>5+</div>)
                        }
                    </div>
                )
            }
        </div>
    );
};