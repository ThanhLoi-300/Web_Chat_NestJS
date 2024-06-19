import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { ConversationAudioCall } from '../conversations/ConversationAudioCall';
import { ConversationVideoCall } from '../conversations/ConversationVideoCall';
import { MessagePanelConversationHeader } from '../headers/MessagePanelConversationHeader';
import { MessagePanelGroupHeader } from '../headers/MessagePanelGroupHeader';
import { FC, Dispatch, SetStateAction } from 'react';

type Props = {
    type: string;
    setShowInfor: Dispatch<SetStateAction<boolean>>;
    showInfor: boolean;
};

export const MessagePanelHeader: FC<Props> = ({ type, setShowInfor, showInfor }) => {
    const { id: routeId } = useParams();
    const { isCalling, isCallInProgress, activeConversationId, callType } =
        useSelector((state: RootState) => state.call);

    const showCallPanel = isCalling || isCallInProgress;
    const isRouteActive = activeConversationId === routeId!;
    // console.log(isRouteActive);
    // console.log(callType === 'video');
    // console.log(callType);
    if (!showCallPanel)
        return type === 'private' ? (
            <MessagePanelConversationHeader setShowInfor={setShowInfor} showInfor={showInfor} />
        ) : (
            <MessagePanelGroupHeader setShowInfor={setShowInfor} showInfor={showInfor} />
        );

    return isRouteActive && callType === 'video' ? (
        <ConversationVideoCall />
    ) : (
        <ConversationAudioCall />
    );
};