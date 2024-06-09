import { FC, useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { getUserFriendInstance } from '../../utils/helpers';
import { CallSidebarItemContainer } from '../../utils/styles';
import { User } from '../../utils/types';
import { UserAvatar } from '../users/UserAvatar';
import { IoMdVideocam, IoMdCall } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {
    friend: User;
};
export const CallSidebarItem: FC<Props> = ({ friend }) => {
    const iconSize = 32;
    const { friends } = useSelector((state: RootState) => state.friends);
    const nameUser = () => {
        return friend?.name.length! > 10 ? friend?.name.slice(0, 10).concat('...') : friend?.name
    }
    return (
        <CallSidebarItemContainer>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                <UserAvatar user={getUserFriendInstance(friend, friends)} />
                <div className="username" style={{ marginLeft: '15px', marginRight: '15px', marginTop: '5px' }}>{nameUser()}</div>
                <div className="icons" style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto', marginRight: '5px' }}>
                    <div className="icon">
                        <IoMdVideocam size={iconSize} />
                    </div>
                    <div className="icon">
                        <IoMdCall size={iconSize} />
                    </div>
                </div>
            </div>
        </CallSidebarItemContainer>
    );
};