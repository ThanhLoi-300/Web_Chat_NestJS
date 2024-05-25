import { FC, Dispatch, SetStateAction } from 'react';
import { SelectedRecipientPillStyle } from '../../utils/styles';
import { User } from '../../utils/types';
import { CircleX } from 'akar-icons';
import { UserAvatar } from '../users/UserAvatar';

type Props = {
    user: User;
    setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
};

export const SelectedRecipientChip: FC<Props> = ({ user, setSelectedUser }) => {
    return (
        <SelectedRecipientPillStyle>
            <div className="container">
                <UserAvatar user={user} />
                <span style={{ marginLeft: '10px' }}>{user.email}</span>
                <CircleX
                    className="icon"
                    size={20}
                    onClick={() => {
                        setSelectedUser(undefined);
                    }}
                />
            </div>
        </SelectedRecipientPillStyle>
    );
};