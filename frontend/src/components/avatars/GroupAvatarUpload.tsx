import { useRef, useState, Dispatch, SetStateAction, FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    AvatarUploadContainer,
    GroupAvatarUploadContainer,
} from '../../utils/styles';
import { FileInput } from '../../utils/styles/inputs/Textarea';
import { InputChangeEvent } from '../../utils/types';
import defaultAvatar from '../../__assets__/default_avatar.jpg';

type Props = {
    setFile: Dispatch<SetStateAction<File | undefined>>;
    setUrlFirebase: Dispatch<SetStateAction<string | undefined>>;
};

export const GroupAvatarUpload: FC<Props> = ({ setFile, setUrlFirebase }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [source, setSource] = useState('');
    const { selectedGroupContextMenu } = useSelector(
        (state: RootState) => state.conversation
    );

    const getGroupAvatar = () => {
        selectedGroupContextMenu && selectedGroupContextMenu.imgGroup && setUrlFirebase(selectedGroupContextMenu.imgGroup)
        return selectedGroupContextMenu && selectedGroupContextMenu.imgGroup
            ? selectedGroupContextMenu.imgGroup
            : defaultAvatar;
    };

    const onFileChange = (e: InputChangeEvent) => {
        const file = e.target.files?.item(0);
        if (file) {
            setSource(URL.createObjectURL(file));
            setFile(file);
            setUrlFirebase(undefined)
        }
    };

    const onAvatarClick = () => fileInputRef.current?.click();

    return (
        <GroupAvatarUploadContainer>
            <AvatarUploadContainer
                onClick={onAvatarClick}
                url={source || getGroupAvatar()}
            ></AvatarUploadContainer>
            <FileInput
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={onFileChange}
            />
        </GroupAvatarUploadContainer>
    );
};