import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  setIsCallInProgress,
  setIsReceivingCall,
  setConnection,
  setCall,
  setActiveConversationId,
} from "../../../store/call/callSlice";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { AcceptedCallPayload } from "../../types";

export function useVideoCallAccept() {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const { peer, localStream } = useSelector((state: RootState) => state.call);

  useEffect(() => {
    socket.on("onVideoCallAccept", (data: AcceptedCallPayload) => {
      console.log("videoCallAccepted");
      dispatch(setIsCallInProgress(true));
      dispatch(setIsReceivingCall(false));
      dispatch(setActiveConversationId(data.conversation._id!));
      if (!peer) return console.log("No peer....");
      if (data.caller._id === user!._id) {
        console.log(peer.id);
        const connection = peer.connect(data.acceptor.peer._id);
        dispatch(setConnection(connection));
        if (!connection) return console.log("No connection");
        if (localStream) {
          console.log("local stream for caller exists!");
          console.log("My local stream:", localStream.id);
          const newCall = peer.call(data.acceptor.peer._id, localStream);
          dispatch(setCall(newCall));
        }
      }
    });
    return () => {
      socket.off("onVideoCallAccept");
    };
  }, [localStream, peer]);
}
