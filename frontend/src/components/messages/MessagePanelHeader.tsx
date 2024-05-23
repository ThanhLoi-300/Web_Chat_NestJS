import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
// import { ConversationAudioCall } from '../conversations/ConversationAudioCall';
// import { ConversationVideoCall } from '../conversations/ConversationVideoCall';
import { MessagePanelConversationHeader } from '../headers/MessagePanelConversationHeader';
import { MessagePanelGroupHeader } from '../headers/MessagePanelGroupHeader';
import { FC } from 'react';

type Props = {
    type: string;
};

export const MessagePanelHeader: FC<Props> = ({ type }) => {
    // const { id: routeId } = useParams();
    // const { isCalling, isCallInProgress, activeConversationId, callType } =
    //     useSelector((state: RootState) => state.call);

    // const showCallPanel = isCalling || isCallInProgress;
    // const isRouteActive = activeConversationId === parseInt(routeId!);
    // console.log(isRouteActive);
    // console.log(callType === 'video');
    // console.log(callType);
    // if (!showCallPanel)
    // return type === 'private' ? (
    //     <MessagePanelConversationHeader  />
    // ) : (
    //     <MessagePanelGroupHeader />
    // );
    return type === 'private' ? (
        <MessagePanelConversationHeader />
    ) : (
        <MessagePanelGroupHeader />
    )

    // return isRouteActive && callType === 'video' ? (
    //     <ConversationVideoCall />
    // ) : (
    //     <ConversationAudioCall />
    // );
};