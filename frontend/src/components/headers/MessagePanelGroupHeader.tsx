import { Dispatch, FC, SetStateAction, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PersonAdd, PeopleGroup } from 'akar-icons';
import { RootState } from '../../store';
import { selectConversationById } from '../../store/conversationsSlice';
import { AuthContext } from '../../utils/context/AuthContext';
import styles from '../groups/index.module.scss';
import {
    MessagePanelHeaderStyle,
    MessagePanelHeaderIcons,
} from '../../utils/styles';
import { AddGroupRecipientModal } from '../modals/AddGroupRecipientModal';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

type Props = {
    setShowInfor: Dispatch<SetStateAction<boolean>>;
    showInfor: boolean;
};

export const MessagePanelGroupHeader: FC<Props> = ({ setShowInfor, showInfor }) => {
    const [showModal, setShowModal] = useState(false);
    const user = useContext(AuthContext).user!;
    const { id } = useParams();
    
    const group = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );

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
                    {/* <PeopleGroup
                        cursor="pointer"
                        size={30}
                        onClick={() => dispatch(toggleSidebar())}
                    /> */}
                    {
                        showInfor ? <FaToggleOn cursor="pointer" size={36} onClick={() => setShowInfor(false)} />
                            : <FaToggleOff cursor="pointer" size={36} onClick={() => setShowInfor(true)} />
                    }
                </MessagePanelHeaderIcons>
            </MessagePanelHeaderStyle>
        </>
    );
};