import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addGroupRecipient, searchFriends } from '../../utils/api';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { SelectedGroupRecipientChip } from '../recipients/SelectedGroupRecipientChip';
import {
    Button,
    RecipientChipContainer,
} from '../../utils/styles';
import styles from './index.module.scss';
import { User } from '../../utils/types';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { toast } from 'react-toastify';
import { GroupRecipientsField } from '../recipients/GroupRecipientsField';
import { addMemberToConversation } from '../../store/conversationsSlice'
import { SocketContext } from '../../utils/context/SocketContext';

export const GroupRecipientAddForm = () => {
    const { id: groupId } = useParams();
    const [query, setQuery] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [searching, setSearching] = useState(false);
    const debouncedQuery = useDebounce(query, 1000);
    const dispatch = useDispatch<AppDispatch>();
    const socket = useContext(SocketContext);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        addGroupRecipient({ id: groupId!, recipentIds: selectedUsers!.map((u)=> u._id) })
            .then(({ data }) => {
                console.log(data);
                toast.success('Added user')
                dispatch(addMemberToConversation(data))
                setSelectedUsers([]);
                socket.emit("addMemberToConversation", data)
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message)
            });
    };

    useEffect(() => {
        if (debouncedQuery) {
            setSearching(true);
            searchFriends(debouncedQuery)
                .then(({ data }) => {
                    console.log(data);
                    setUserResults(data);
                })
                .catch((err) => console.log(err))
                .finally(() => setSearching(false));
        }
    }, [debouncedQuery]);

    const handleUserSelect = (user: User) => {
        const exists = selectedUsers.find((u) => u._id === user._id);
        if (!exists) setSelectedUsers((prev) => [...prev, user]);
    };

    const removeUser = (user: User) =>
        setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));

    return (
        <form className={styles.createConversationForm} onSubmit={onSubmit}>
            <RecipientChipContainer>
                {selectedUsers.map((user) => (
                    <SelectedGroupRecipientChip user={user} removeUser={removeUser} />
                ))}
            </RecipientChipContainer>
            <GroupRecipientsField setQuery={setQuery} />
            {userResults.length > 0 && query && (
                <RecipientResultContainer
                    userResults={userResults}
                    handleUserSelect={handleUserSelect}
                />
            )}
            <Button style={{ margin: '10px 0' }} disabled={selectedUsers.length > 0 ? false:true}>
                Add Recipient
            </Button>
        </form>
    );
};
