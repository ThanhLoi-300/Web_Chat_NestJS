import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { GroupMessageType, MessageType } from '../../utils/types';
import { SelectedMessageContextMenu } from '../context-menus/SelectedMessageContextMenu';
import { selectConversationMessage } from '../../store/Messages/messageSlice';
// import { selectGroupMessage } from '../../store/groupMessagesSlice';
// import { selectType } from '../../store/selectedSlice';
import { MessageItemHeader } from './MessageItemHeader';
import { MessageItemContainerBody } from './MessageItemContainerBody';
import { useHandleClick, useKeydown } from '../../utils/hooks';
import { UserAvatar } from '../users/UserAvatar';
import {
    MessageContainerStyle,
    MessageItemContainer,
    MessageItemDetails,
} from '../../utils/styles';
import {
    editMessageContent,
    resetMessageContainer,
    setContextMenuLocation,
    setIsEditing,
    setSelectedMessage,
    toggleContextMenu,
} from '../../store/messageContainerSlice';
import { useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
// import { SystemMessage } from './system/SystemMessage';
// import { SystemMessageList } from './system/SystemMessageList';

export const MessageContainer = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch<AppDispatch>();
    const conversationMessages = useSelector((state: RootState) =>
        selectConversationMessage(state, id!)
    );
    // const groupMessages = useSelector((state: RootState) =>
    //     selectGroupMessage(state, parseInt(id!))
    // );
    // const selectedType = useSelector((state: RootState) => selectType(state));
    const { showContextMenu } = useSelector(
        (state: RootState) => state.messageContainer
    );
    const handleKeydown = (e: KeyboardEvent) =>
        e.key === 'Escape' && dispatch(setIsEditing(false));
    const handleClick = () => dispatch(toggleContextMenu(false));

    useKeydown(handleKeydown, [id]);
    useHandleClick(handleClick, [id]);

    useEffect(() => {
        return () => {
            dispatch(resetMessageContainer());
        };
    }, [id]);

    const onContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        message: MessageType | GroupMessageType
    ) => {
        e.preventDefault();
        dispatch(toggleContextMenu(true));
        dispatch(setContextMenuLocation({ x: e.pageX, y: e.pageY }));
        dispatch(setSelectedMessage(message));
    };

    const onEditMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(editMessageContent(e.target.value));
    }

    const mapMessages = (
        message: MessageType,
        index: number,
        messages: MessageType[]
    ) => {
        const currentMessage = messages[index];
        const nextMessage = messages[index + 1];
        const showMessageHeader =
            messages.length === index + 1 ||
            currentMessage.senderId._id !== nextMessage.senderId._id;
        const owner = currentMessage.senderId._id === user?._id

        return (
            <MessageItemContainer owner={owner}
                key={message._id}
                style={{ float: 'right'}}
                onContextMenu={(e) => onContextMenu(e, message)}
            >
                {showMessageHeader && !owner && <UserAvatar user={message.senderId} />}
                {showMessageHeader ? (
                    <MessageItemDetails>
                        <MessageItemHeader message={message} />
                        <MessageItemContainerBody
                            message={message}
                            onEditMessageChange={onEditMessageChange}
                            padding="0"
                            owner={owner}
                        />
                    </MessageItemDetails>
                ) : (
                    <MessageItemContainerBody
                        message={message}
                        onEditMessageChange={onEditMessageChange}
                        padding="0"
                        owner={owner}
                    />
                )}
            </MessageItemContainer>
        );
    };

    return (
        <MessageContainerStyle
            onScroll={(e) => {
                const node = e.target as HTMLDivElement;
                const scrollTopMax = node.scrollHeight - node.clientHeight;
                if (-scrollTopMax === node.scrollTop) {
                    console.log('');
                }
            }}
        >
            <>
                {/* <SystemMessageList /> */}
                {/* {selectedType === 'private'
                    ? conversationMessages?.messages.map(mapMessages)
                    : groupMessages?.messages.map(mapMessages)} */}
                {conversationMessages?.messages.map(mapMessages)}
            </>
            {showContextMenu && <SelectedMessageContextMenu />}
        </MessageContainerStyle>
    );
};