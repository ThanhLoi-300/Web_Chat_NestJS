import { useState, useRef, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
    setIsSavingChanges,
    setShowEditGroupModal,
    // updateGroupDetailsThunk,
    updateGroupDetail
} from '../../store/conversationsSlice';
import { useBeforeUnload } from '../../utils/hooks';
import {
    Button,
    Form,
    InputContainer,
    InputField,
    InputLabel,
} from '../../utils/styles';
import { Conversation, FormEvent } from '../../utils/types';
import { GroupAvatarUpload } from '../avatars/GroupAvatarUpload';
import { toast } from 'react-toastify';
import { uploadFile }  from "../../utils/uploadFile"
import { SocketContext } from '../../utils/context/SocketContext';
import { updateGroupDetails } from "../../utils/api"

export const EditGroupForm = () => {
    const socket = useContext(SocketContext);
    const { selectedGroupContextMenu: group, isSavingChanges } = useSelector(
        (state: RootState) => state.conversation
    );
    const dispatch = useDispatch<AppDispatch>();
    const formRef = useRef<HTMLFormElement>(null);
    const [file, setFile] = useState<File>();
    const [urlFirebase, setUrlFirebase] = useState<string>();
    const [newGroupTitle, setNewGroupName] = useState(group?.nameGroup);
    const isStateChanged = useCallback(
        () => file || group?.nameGroup !== newGroupTitle,
        [file, newGroupTitle, group?.nameGroup]
    );

    useBeforeUnload(
        (e) => isStateChanged() && (e.returnValue = 'You have unsaved changes'),
        [isStateChanged]
    );

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!group) throw new Error('Group Undefined');

        let img
        if(file) img = await uploadFile(file)
        else if (urlFirebase) img = urlFirebase
        else return

        dispatch(setIsSavingChanges(true));
        updateGroupDetails({ _id: group._id!, nameGroup: newGroupTitle ? newGroupTitle : group!.nameGroup!, avatarGroup: img!  })
            .then((data: any) => {
                console.log("updateGroupDetailsThunk"+ JSON.stringify(data.data))
                dispatch(setShowEditGroupModal(false));
                dispatch(updateGroupDetail(data.data))
                socket.emit("updateGroupDetails", {conversation: data.data})
                toast.success('Group Details Updated!');
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error Saving Changes. Try again.');
            })
            .finally(() => dispatch(setIsSavingChanges(false)));
    };

    return (
        <Form onSubmit={onSubmit} ref={formRef}>
            <GroupAvatarUpload setFile={setFile} setUrlFirebase={setUrlFirebase} />
            <InputContainer backgroundColor="#161616">
                <InputLabel htmlFor="groupName">Group Name</InputLabel>
                <InputField
                    id="groupName"
                    value={newGroupTitle}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    disabled={isSavingChanges}
                />
            </InputContainer>
            <Button
                style={{ margin: '10px 0' }}
                disabled={!isStateChanged() || isSavingChanges}
            >
                Save
            </Button>
        </Form>
    );
};