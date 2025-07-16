import React from 'react';
import { usePopup } from './PopupContext';
import styles from './Popup.module.css'
const Popup: React.FC = () => {
    const { message, show } = usePopup();

    return (
        <>
            <div className={`${styles.message} ${show ? styles.show : ''}`}>
                {message}
            </div>
        </>
    );
};

export default Popup;
