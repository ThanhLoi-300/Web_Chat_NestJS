import { CircleX } from 'akar-icons';
import { FC } from 'react';
import { SelectedRecipientPillStyle } from '../../utils/styles';
import { User } from '../../utils/types';
import { UserAvatar } from '../users/UserAvatar';

type Props = {
    user: User;
    removeUser: (user: User) => void;
};

export const SelectedGroupRecipientChip: FC<Props> = ({ user, removeUser }) => {
    return (
        <SelectedRecipientPillStyle>
            <div className="container">
                <UserAvatar user={user} />
                <span style={{ marginLeft: '10px' }}>{user.email}</span>
                <CircleX className="icon" size={20} onClick={() => removeUser(user)} />
            </div>
        </SelectedRecipientPillStyle>
    );
};