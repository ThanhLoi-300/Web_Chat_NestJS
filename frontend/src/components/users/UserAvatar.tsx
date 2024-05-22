import { FC } from 'react';
import { CDN_URL } from '../../utils/constants';
import { UserAvatarContainer } from '../../utils/styles';
import { User } from '../../utils/types';
import defaultAvatar from '../../__assets__/default_avatar.jpg';

type Props = {
    user: User;
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
};

export const UserAvatar: FC<Props> = ({ user, onClick }) => {
    const getProfilePicture = () => {
        const { avatar } = user;
        return avatar ? CDN_URL.BASE.concat(avatar) : defaultAvatar;
    };

    return (
        <UserAvatarContainer
            src={getProfilePicture()}
            alt="avatar"
            onClick={onClick}
        />
    );
};