import { FC, Dispatch, SetStateAction, useEffect, createRef } from 'react';
import { MdClose } from 'react-icons/md';
import { ModalContainer, ModalHeader, ModalContentBody } from '.';
import { OverlayStyle } from '../../utils/styles';
import { SendFriendRequestForm } from '../forms/SendFriendRequestForm';
import { User } from '../../utils/types';

type Props = {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    friend?: User;
};

export const CreateFriendRequestModal: FC<Props> = ({ setShowModal, friend }) => {
    const ref = createRef<HTMLDivElement>();
    const handleOverlayClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const { current } = ref;
        if (current === e.target) {
            console.log('Close Modal');
            setShowModal(false);
        }
    };
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) =>
            e.key === 'Escape' && setShowModal(false);
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    return (
        <OverlayStyle ref={ref} onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <h2>Send a Friend Request</h2>
                    <MdClose size={32} onClick={() => setShowModal(false)} />
                </ModalHeader>
                <ModalContentBody>
                    <SendFriendRequestForm setShowModal={setShowModal} friend={friend} />
                </ModalContentBody>
            </ModalContainer>
        </OverlayStyle>
    );
};