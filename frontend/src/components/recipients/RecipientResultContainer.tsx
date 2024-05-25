import { FC } from 'react';
import {
    RecipientResultContainerStyle,
    RecipientResultItem,
    RecipientScrollableItemContainer,
} from '../../utils/styles';
import { User } from '../../utils/types';
import { UserAvatar } from '../users/UserAvatar';

type Props = {
    userResults: User[];
    handleUserSelect: (user: User) => void;
};

export const RecipientResultContainer: FC<Props> = ({
    userResults,
    handleUserSelect,
}) => {
    return (
        <RecipientResultContainerStyle>
            <RecipientScrollableItemContainer>
                {userResults.map((user) => (
                    <RecipientResultItem
                        key={user._id}
                        onClick={() => handleUserSelect(user)}
                    >
                        <UserAvatar user={user} />
                        <span>{user.email}</span>
                    </RecipientResultItem>
                ))}
            </RecipientScrollableItemContainer>
        </RecipientResultContainerStyle>
    );
};