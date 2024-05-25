import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PersonAdd, PeopleGroup } from 'akar-icons';
import { RootState, AppDispatch } from '../../store';
import { toggleSidebar } from '../../store/groupRecipientsSidebarSlice';
import { selectConversationById } from '../../store/conversationsSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import { CDN_URL } from '../../utils/constants';
import styles from '../groups/index.module.scss';
import {
    MessagePanelHeaderStyle,
    MessagePanelHeaderIcons,
} from '../../utils/styles';
import { AddGroupRecipientModal } from '../modals/AddGroupRecipientModal';

export const MessagePanelGroupHeader = () => {
    const [showModal, setShowModal] = useState(false);
    const user = useContext(AuthContext).user!;
    const { id } = useParams();
    
    const group = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );
    const dispatch = useDispatch<AppDispatch>();

    return (
        <>
            {showModal && (
                <AddGroupRecipientModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
            <MessagePanelHeaderStyle>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {group?.imgGroup ? (
                        <img
                            src={group.imgGroup}
                            alt="avatar"
                            className={styles.groupAvatar}
                        />
                    ) : (
                        <div className={styles.defaultGroupAvatar}>
                            <PeopleGroup size={28} />
                        </div>
                    )}
                    <span>{group?.nameGroup}</span>
                </div>
                <MessagePanelHeaderIcons>
                    {user?._id === group?.owner?._id && (
                        <PersonAdd
                            cursor="pointer"
                            size={30}
                            onClick={() => setShowModal(true)}
                        />
                    )}
                    <PeopleGroup
                        cursor="pointer"
                        size={30}
                        onClick={() => dispatch(toggleSidebar())}
                    />
                </MessagePanelHeaderIcons>
            </MessagePanelHeaderStyle>
        </>
    );
};