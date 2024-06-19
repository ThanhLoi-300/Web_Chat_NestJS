import { MessageTextarea } from '../../utils/styles/inputs/Textarea';
import { FC, Dispatch, SetStateAction, useRef, useContext } from 'react';
import { ClipboardEvent, DragEvent, User, Conversation } from '../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import {
    addAttachment,
    incrementAttachmentCounter,
} from '../../store/message-panel/messagePanelSlice';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import React from 'react';
import { AuthContext } from '../../utils/context/AuthContext';

type Props = {
    setContentInput: Dispatch<SetStateAction<string>>;
    setMessage: Dispatch<SetStateAction<string>>;
    setIsMultiLine: Dispatch<SetStateAction<boolean>>;
    sendTypingStatus: () => void;
    sendMessage: () => void;
    conversation: Conversation;
    setSearchResults: Dispatch<SetStateAction<any[]>>;
    contentInput: string;
    content: string
};

export const MessageTextField: FC<Props> = ({
    setContentInput,
    setMessage,
    setIsMultiLine,
    sendTypingStatus,
    sendMessage,
    conversation,
    setSearchResults,
    contentInput,
    content
}) => {
    const DEFAULT_TEXTAREA_HEIGHT = 21;
    const ref = useRef<HTMLTextAreaElement>(null);
    const dispatch = useDispatch();
    const { attachments, attachmentCounter } = useSelector(
        (state: RootState) => state.messagePanel
    );
    const user = useContext(AuthContext).user!;

    const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setMessage(content + e.target.value.slice(-1));
        setContentInput(e.target.value)
        console.log("e.target.value: " + content)
        var text = e.target.value

        // Tìm vị trí cuối cùng của dấu '@'
        const lastAtIndex = text.lastIndexOf('@');

        if (lastAtIndex !== -1 && lastAtIndex === text.length - 1) {
            // Trích xuất từ khóa tìm kiếm
            const mentionText = text.slice(lastAtIndex + 1);

            // Gọi hàm search tên member
            const members: User[] = searchMembers(mentionText);
            const all = {
                name: 'All',
                avatar: 'https://tse1.mm.bing.net/th?id=OIP.Bngo6ojjIjs_TsJWpPzUCQHaEK&pid=Api&P=0&h=220',
                _id: 'All'
            }
            if (mentionText.startsWith("a") || mentionText.startsWith("A") || mentionText === '')
                setSearchResults([all, ...members]);
            else setSearchResults(members);
        } else {
            setSearchResults([]);
        }

        const { current } = ref;
        if (current) {
            const height = parseInt(current.style.height);
            current.style.height = '5px';
            current.style.height = current.scrollHeight + 'px';
            height > DEFAULT_TEXTAREA_HEIGHT
                ? setIsMultiLine(true)
                : setIsMultiLine(false);
        }
    };

    const searchMembers = (keyword: string) => {
        // Thực hiện việc tìm kiếm tên member và trả về kết quả
        // Ví dụ:
        return conversation.member.filter((u) => u.name.toLowerCase().includes(keyword.toLowerCase()) && u._id !== user._id);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        sendTypingStatus();
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            setIsMultiLine(false);
            if (ref.current) ref.current.style.height = '21px';
        }
    };

    const handleFileAdd = (files: FileList) => {
        const maxFilesDropped = 5 - attachments.length;
        if (maxFilesDropped === 0) return toast.error('Max files reached');
        const filesArray = Array.from(files);
        let localCounter = attachmentCounter;
        for (let i = 0; i < filesArray.length; i++) {
            console.log(filesArray[i]);
            if (i === maxFilesDropped) break;
            dispatch(addAttachment({ id: localCounter++, file: filesArray[i] }));
            dispatch(incrementAttachmentCounter());
        }
    };

    const onDrop = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const { files } = e.dataTransfer;
        handleFileAdd(files);
    };

    const onPaste = (e: ClipboardEvent) => {
        const { files } = e.clipboardData;
        console.log('pasting...');
        console.log(files);
        handleFileAdd(files);
    };

    return (
        <MessageTextarea
            ref={ref}
            value={contentInput}
            onChange={onMessageChange}
            placeholder="Send a Message"
            onKeyDown={onKeyDown}
            onDrop={onDrop}
            onPaste={onPaste}
        ></MessageTextarea>
    );
};