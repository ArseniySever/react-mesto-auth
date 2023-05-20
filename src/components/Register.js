import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registration } from '../utils/Auth';

function Register(props) {
  const navigate = useNavigate();
  const [formValues, setFormValues] = React.useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formValues;
    if (email && password) {
      registration(email, password)
        .then((res) => {
          props.setInfoTooltipData({ isSuccess: true, message: 'Вы успешно зарегистрировались!' });
          props.setInfoTooltipOpen(true);
          navigate('/sign-in', {replace: true});
          handleLogin(email, password);

        })
        .catch((err) => {
          props.setInfoTooltipData({ isSuccess: false, message: 'Что-то пошло не так! Попробуйте ещё раз.' });
          props.setInfoTooltipOpen(true);
        });
    }
  };

  const handleLogin = (email, password) => {
    props.onLogin(email, password);
  }

  return (
    <div className='auth-section'>
      <form className="auth-section__form" onSubmit={handleRegisterSubmit}>
        <h1 className="auth-section__title">Регистрация</h1>
        <input
          className="auth-section__input"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          className="auth-section__input"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleInputChange}
          placeholder="Пароль"
          required
        />
        
        <button type="submit" className="auth-section__button">Зарегистрироваться</button>
        <p className="auth-section__text">Уже зарегистрированы? <Link className="auth-section__link" to="/sign-in">Войти</Link></p>
      </form>
    </div>
  );
}

export default Register;
