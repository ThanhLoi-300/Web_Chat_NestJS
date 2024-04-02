import { FC, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { CDN_URL } from '../../../utils/constants';
import { useKeydown } from '../../../utils/hooks';
import { OverlayStyle } from '../../../utils/styles';
import { GroupMessageType, MessageType } from '../../../utils/types';
import styles from '../index.module.scss';

type Props = {
    message: MessageType | GroupMessageType;
};
export const MessageItemAttachmentContainer: FC<Props> = ({ message }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const onClick = (key: string) => {
        setShowOverlay(true);
        setImageUrl(key);
    };

    const handleKeydown = (e: KeyboardEvent) =>
        e.key === 'Escape' && setShowOverlay(false);
    useKeydown(handleKeydown);

    return (
        <>
            {showOverlay && (
                <OverlayStyle>
                    <MdClose
                        className={styles.closeIcon}
                        onClick={() => setShowOverlay(false)}
                    />
                    <img src={imageUrl} alt="overlay" style={{ maxHeight: '90%' }} />
                </OverlayStyle>
            )}
            <div style={{ marginTop: '30px' }}>
                {message.attachments?.map((attachment) => (
                    <img
                        key={attachment}
                        src={attachment}
                        width={150}
                        alt={attachment}
                        onClick={() => onClick(attachment)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </div>
        </>
    );
};