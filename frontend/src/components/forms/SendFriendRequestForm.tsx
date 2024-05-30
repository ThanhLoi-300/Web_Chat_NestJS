import React, { FC, useState, Dispatch, SetStateAction, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createFriendRequestThunk } from '../../store/friends/friendsThunk';
import {
    Button,
} from '../../utils/styles';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { searchUsers } from '../../utils/api';
import { RecipientField } from '../recipients/RecipientField';
import { RecipientResultContainer } from '../recipients/RecipientResultContainer';
import { SocketContext } from '../../utils/context/SocketContext';
import { User } from '../../utils/types';

type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    friend?: User;
};

export const SendFriendRequestForm: FC<Props> = ({ setShowModal, friend }) => {
    const [query, setQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User>();
    const [searching, setSearching] = useState(false);
    const [userResults, setUserResults] = useState<User[]>([]);
    const socket = useContext(SocketContext);

    const debouncedQuery = useDebounce(query, 1000);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        friend && setSelectedUser(friend)
    }, []);

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
        dispatch(createFriendRequestThunk(selectedUser._id))
            .unwrap()
            .then(() => {
                console.log('Success Friend Request');
                setShowModal(false);
                toast.success('Friend Request Sent!');
                socket.emit('onFriendRequestReceived', {
                    receiverId: selectedUser._id
                })
            })
            .catch((err) => {
                console.log(err);
                if (err.code === "ERR_BAD_REQUEST")
                    toast.error('Friend Requesting Pending');
                else toast.error('Friend Already Exists');
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
                friend={friend}
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