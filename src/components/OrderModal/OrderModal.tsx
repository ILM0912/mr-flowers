import style from './OrderModal.module.css';
import { ReactComponent as LoadingIcon } from '../../../src/images/loading.svg';
import { ReactComponent as ErrorIcon } from '../../../src/images/error.svg';
import { ReactComponent as SuccessIcon } from '../../../src/images/success.svg';
import { useEffect, useRef } from 'react';

type Props = {
  status: 'loading' | 'success' | 'error';
  onExit: () => void;
};

const OrderModal = ({ status, onExit }: Props) => {
    const handleOverlayClick = () => {
        onExit();
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className={style.container} onClick={handleOverlayClick}>
            <div className={style.modal} onClick={handleModalClick}>
                {status === 'loading' && (
                    <>
                        <LoadingIcon className={`${style.modal__icon} ${style.modal__icon_loading}`} />
                        <p className={style.modal__message}>Идёт оформление заказа...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <ErrorIcon className={style.modal__icon} />
                        <p className={style.modal__message}>Произошла ошибка при оформлении заказа.</p>
                    </>
                    
                )}
                {status === 'success' && (
                    <>
                        <SuccessIcon className={style.modal__icon} />
                        <p className={style.modal__message}>Ваш заказ успешно оформлен!</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderModal;
