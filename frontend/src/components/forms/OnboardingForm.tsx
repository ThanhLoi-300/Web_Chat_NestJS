import { Dispatch, createRef, useEffect, FC, useState, useContext } from 'react';
import { MdClose } from 'react-icons/md';
import { OverlayStyle } from '../../utils/styles';
import { Conversation, User } from '../../utils/types';
import { ModalContainer, ModalContentBody } from '../modals';
import { UserAvatar } from '../users/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { CreateFriendRequestModal } from '../modals/CreateFriendRequestModal';
import { AuthContext } from '../../utils/context/AuthContext';
import { createConversationThunk } from '../../store/conversationsSlice';
import { checkConversationOrCreate } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

type Props = {
    showModalProfile: boolean;
    setShowModalProfile: Dispatch<React.SetStateAction<boolean>>;
    user: User;
};

export const OnboardingForm: FC<Props> = ({
    showModalProfile,
    setShowModalProfile,
    user
}) => {
    const ref = createRef<HTMLDivElement>();
    const [showModal, setShowModal] = useState(false);
    const me = useContext(AuthContext).user!;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const friends = useSelector(
        (state: RootState) => state.friends.friends
    );

    const isFriend = () => {
        if(me._id === user._id) return false
        return friends.some((u) => u._id === user._id)
    }

    const isMessage = me._id === user?._id

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) =>
            e.key === 'Escape' && setShowModalProfile(false);
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    const handleOverlayClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const { current } = ref;
        if (current === e.target) {
            console.log('Close Modal');
            setShowModalProfile(false);
        }
    };

    const buttonStyle = {
        padding: '4px 8px',
        borderRadius: '5px',
        fontSize: '20px',
        cursor: 'pointer',
        width: '100%'
    };

    const sendMessage = () => {
            checkConversationOrCreate(user._id)
                .then(({ data }) => {
                    console.log(data);
                    navigate(`/conversations/${data._id}`);
                })
                .catch(() => {
                    const conversation: Conversation = {
                        type: 'private',
                        member: [user, me]
                    }

                    return dispatch(
                        createConversationThunk(conversation!)
                    )
                        .unwrap()
                        .then(({ data }) => {
                            navigate(`/conversations/${data._id}`);
                        })
                        .catch((err) => console.log(err));
                });
    };


    return (
        <OverlayStyle ref={ref} onClick={handleOverlayClick}>
            <ModalContainer showModal={showModalProfile}>
                <ModalContentBody>
                    Profile
                    <MdClose
                        cursor="pointer"
                        size={32}
                        style={{ margin: "10px", float: "right", marginTop: "-10px" }}
                        onClick={() => setShowModalProfile(false)}
                    />
                    <img
                        src={user.banner ? user.banner : "https://tse1.mm.bing.net/th?id=OIP.qISjQuz0VsrKxe81_sA7twHaHa&pid=Api&P=0&h=220"} style={{
                            width: "100%", height: "200px"
                        }}
                    />
                    <div style={{ marginLeft: "10px", marginTop: '-50px', display: "flex", gap: "20px" }}>
                        <UserAvatar size={90} user={user} />
                        <p style={{ fontSize: "20px", marginTop: "50px" }}>{user.name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: "10px", justifyContent: 'center', marginTop: "20px", width: '100%' }}>
                        {!isFriend && (<button style={buttonStyle} onClick={() => setShowModal(true)}>Add friend</button>)}
                        {!isMessage && (<button style={buttonStyle} onClick={() => sendMessage()}>Message</button>)}
                    </div>
                </ModalContentBody>
            </ModalContainer>
            {showModal && <CreateFriendRequestModal setShowModal={setShowModal} friend={user} />}
        </OverlayStyle>
    );
};