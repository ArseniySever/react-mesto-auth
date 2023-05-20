import React from 'react';
import successImage from "../images/Unionfirst.png";
import failImage from "../images/Union.png";
import App from './App';

function InfoTooltip(props) {
    return (
        <section className={props.isOpen ? 'popup popup_opened' : 'popup'} onClick={props.onClose}>
            <div className="popup__container">
                <button className="popup__close" type="button" onClick={props.onClose}></button>
                <div className='auth-check'>
                    <img
                        className="auth-check__img"
                        src={props.status ? successImage : failImage}
                        alt={`Иконка регистрации на сайте`}
                    />
                    <h3 className="auth-check__text">
                      {props.status ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
                    </h3>
                </div>
            </div>
        </section>
    )
}
export default InfoTooltip;