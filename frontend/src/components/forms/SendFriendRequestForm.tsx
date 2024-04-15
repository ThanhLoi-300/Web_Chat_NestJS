import React, { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createFriendRequestThunk } from '../../store/friends/friendsThunk';
import {
    Button,
    InputContainer,
    InputField,
    InputLabel,
} from '../../utils/styles';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import { User } from '../../utils/types';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { searchUsers } from '../../utils/api';
import { RecipientField } from '../recipients/RecipientField';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';

type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
};

export const SendFriendRequestForm: FC<Props> = ({ setShowModal }) => {
    const [query, setQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User>();
    const [searching, setSearching] = useState(false);
    const [userResults, setUserResults] = useState<User[]>([]);
    // const { success, error } = useToast({ theme: 'dark' });

    const debouncedQuery = useDebounce(query, 1000);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (debouncedQuery) {
            setSearching(true);
            searchUsers(debouncedQuery)
                .then(({ data }) => {
                    console.log(data);
                    setUserResults(data);
                })
                .catch((err) => console.log(err))
                .finally(() => setSearching(false));
        }
    }, [debouncedQuery]);
    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUser) return;
        dispatch(createFriendRequestThunk(selectedUser.id))
            .unwrap()
            .then(() => {
                console.log('Success Friend Request');
                setShowModal(false);
                //success('Friend Request Sent!');
            })
            .catch((err: Error) => {
                console.log(err);
                toast.error(err.message);
            });
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setUserResults([]);
        setQuery('');
    };

    return (
        <form className={styles.createConversationForm} onSubmit={onSubmit}>
            <RecipientField
                selectedUser={selectedUser}
                setQuery={setQuery}
                setSelectedUser={setSelectedUser}
            />
            {!selectedUser && userResults.length > 0 && query && (
                <RecipientResultContainer
                    userResults={userResults}
                    handleUserSelect={handleUserSelect}
                />
            )}
            <Button>Send</Button>
        </form>
    );
};