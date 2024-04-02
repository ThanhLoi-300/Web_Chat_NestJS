import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addGroupRecipient, searchUsers } from '../../utils/api';
// import { useToast } from '../../utils/hooks/useToast';
import {
    Button,
    InputContainer,
    InputField,
    InputLabel,
} from '../../utils/styles';
import styles from './index.module.scss';
import { RecipientField } from '../recipients/RecipientField';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { User } from '../../utils/types';
import { createConversationThunk } from '../../store/conversationsSlice';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { toast } from 'react-toastify';

export const GroupRecipientAddForm = () => {
    const { id: groupId } = useParams();
    const [query, setQuery] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [searching, setSearching] = useState(false);
    const debouncedQuery = useDebounce(query, 1000);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // const { success, error } = useToast({ theme: 'dark' });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addGroupRecipient({ id: parseInt(groupId!), recipentId: selectedUser?.id! })
            .then(({ data }) => {
                console.log(data);
                toast.success('Added user')
                setSelectedUser(undefined);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message)
            });
    };

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
            <Button style={{ margin: '10px 0' }} disabled={!selectedUser}>
                Add Recipient
            </Button>
        </form>
    );
};

function setShowModal(arg0: boolean) {
    throw new Error('Function not implemented.');
}
