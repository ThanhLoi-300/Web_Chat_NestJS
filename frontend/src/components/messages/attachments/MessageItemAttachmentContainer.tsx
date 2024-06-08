import { FC, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useKeydown } from '../../../utils/hooks';
import { OverlayStyle } from '../../../utils/styles';
import { MessageType } from '../../../utils/types';
import styles from '../index.module.scss';

type Props = {
    message: MessageType;
    owner: boolean;
};
export const MessageItemAttachmentContainer: FC<Props> = ({ message, owner }) => {
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
                <OverlayStyle style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}>
                    <MdClose
                        className={styles.closeIcon}
                        size={50}
                        onClick={() => setShowOverlay(false)}
                    />
                    <img src={imageUrl} alt="overlay" style={{ maxHeight: '90%' }} />
                </OverlayStyle>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: owner ? 'flex-end' : 'flex-start'}}>
                {message.img?.map((attachment) => (
                    <img
                        key={attachment}
                        src={attachment}
                        width={130}
                        alt={attachment}
                        onClick={() => onClick(attachment)}
                        style={{ cursor: 'pointer', marginLeft: '5px', float: owner ? 'right' : 'left', objectFit: 'fill' }}
                    />
                ))}
            </div>
        </>
    );
};