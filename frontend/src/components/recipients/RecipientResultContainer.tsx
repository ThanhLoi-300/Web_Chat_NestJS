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
    background: string
};

export const RecipientResultContainer: FC<Props> = ({
    userResults,
    handleUserSelect,
    background
}) => {
    return (
        <RecipientResultContainerStyle background={background}>
            <RecipientScrollableItemContainer>
                {userResults.map((user) => (
                    <RecipientResultItem
                        key={user._id}
                        onClick={() => handleUserSelect(user)}
                    >
                        <UserAvatar user={user} />
                        {
                            background === 'white' ? (<span>{user.name}</span>) : (<span>{user.email}</span>)
                        }
                    </RecipientResultItem>
                ))}
            </RecipientScrollableItemContainer>
        </RecipientResultContainerStyle>
    );
};