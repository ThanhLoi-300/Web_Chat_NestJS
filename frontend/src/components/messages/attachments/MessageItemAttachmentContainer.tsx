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
                <OverlayStyle>
                    <MdClose
                        className={styles.closeIcon}
                        onClick={() => setShowOverlay(false)}
                    />
                    <img src={imageUrl} alt="overlay" style={{ maxHeight: '90%' }} />
                </OverlayStyle>
            )}
            <div style={{marginTop: '13px'}}>
                {message.img?.map((attachment) => (
                    <img
                        key={attachment}
                        src={attachment}
                        width={150}
                        alt={attachment}
                        onClick={() => onClick(attachment)}
                        style={{ cursor: 'pointer', marginLeft: '5px', float: owner ? 'right' : 'left'}}
                    />
                ))}
            </div>
        </>
    );
};