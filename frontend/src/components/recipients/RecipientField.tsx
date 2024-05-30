import { FC, Dispatch, SetStateAction } from 'react';
import { InputContainer, InputLabel, InputField } from '../../utils/styles';
import { User } from '../../utils/types';
import { SelectedRecipientChip } from './SelectedRecipientChip';

type Props = {
    selectedUser: User | undefined;
    setQuery: Dispatch<SetStateAction<string>>;
    setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
    friend?: User,
};

export const RecipientField: FC<Props> = ({
    selectedUser,
    setQuery,
    setSelectedUser,
    friend
}) => (
    <section>
        <InputContainer backgroundColor="#161616">
            <InputLabel>Recipient</InputLabel>
            {selectedUser || friend ? (
                <SelectedRecipientChip
                    user={friend ? friend! : selectedUser!}
                    setSelectedUser={setSelectedUser}
                />
            ) : (
                <InputField onChange={(e) => setQuery(e.target.value)} />
            )}
        </InputContainer>
    </section>
);