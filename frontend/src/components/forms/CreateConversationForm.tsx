import React, { Dispatch, FC, useContext, useEffect, useState } from 'react';
import {
    Button,
} from '../../utils/styles';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { createConversationThunk } from '../../store/conversationsSlice';
import { Conversation, User } from '../../utils/types';
import { AppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { searchUsers } from '../../utils/api';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { RecipientField } from '../recipients/RecipientField';
import { AuthContext } from '../../utils/context/AuthContext';

type Props = {
    setShowModal: Dispatch<React.SetStateAction<boolean>>;
};

export const CreateConversationForm: FC<Props> = ({ setShowModal }) => {
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [searching, setSearching] = useState(false);
    const debouncedQuery = useDebounce(query, 1000);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    console.log(searching)

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
        if (!selectedUser || !user?._id) return;
        const conversation: Conversation = {
            type: 'private',
            member: [selectedUser, user]
        }

        return dispatch(
            createConversationThunk(conversation!)
        )
            .unwrap()
            .then(({ data }) => {
                setShowModal(false);
                navigate(`/conversations/${data._id}`);
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