import { FC } from 'react';
import { UserAvatarContainer } from '../../utils/styles';
import { User } from '../../utils/types';
import defaultAvatar from '../../__assets__/default_avatar.jpg';
import { Crown } from 'akar-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useParams } from 'react-router-dom';
import { selectConversationById } from '../../store/conversationsSlice';

type Props = {
    user: User;
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
    size?: number;
};

export const UserAvatar: FC<Props> = ({ user, onClick, size }) => {
    const { id } = useParams();
    const group = useSelector((state: RootState) =>
        selectConversationById(state, id!)
    );
    const getProfilePicture = () => {
        const { avatar } = user;
        return avatar ? avatar : defaultAvatar;
    };

    if (size! > 0) {
        return (
            <UserAvatarContainer
                src={getProfilePicture()}
                alt="avatar"
                onClick={onClick}
                style={{ width: size, height: size, display: 'flex', justifyContent: 'flex-end' }}
            />
        );
    } else {
        return (
            <div >
                <UserAvatarContainer
                    src={getProfilePicture()}
                    alt="avatar"
                    onClick={onClick}
                />
                {user._id === group?.owner?._id && <Crown style={{ bottom: 0, marginLeft: '-25px' }} color="#ffbf00" />}
            </div>
        );
    }
};