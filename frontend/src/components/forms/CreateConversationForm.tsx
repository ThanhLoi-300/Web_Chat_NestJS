import React, { Dispatch, FC, useEffect, useState } from 'react';
import {
    Button,
    InputContainer,
    InputLabel,
    TextField,
} from '../../utils/styles';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { createConversationThunk } from '../../store/conversationsSlice';
import { User } from '../../utils/types';
import { AppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { searchUsers } from '../../utils/api';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { RecipientField } from '../recipients/RecipientField';

type Props = {
    setShowModal: Dispatch<React.SetStateAction<boolean>>;
};

export const CreateConversationForm: FC<Props> = ({ setShowModal }) => {
    const [query, setQuery] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [searching, setSearching] = useState(false);
    const debouncedQuery = useDebounce(query, 1000);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

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
        if ( !selectedUser) return;
        return dispatch(
            createConversationThunk({ id: selectedUser.id })
        )
            .unwrap()
            .then(({ data }) => {
                console.log(data);
                console.log('done');
                setShowModal(false);
                navigate(`/conversations/${data.id}`);
            })
            .catch((err) => console.log(err));
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
            <Button>Create Conversation</Button>
        </form>
    );
};