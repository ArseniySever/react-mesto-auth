import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import "../index.css";
import api from "../utils/Api";
import * as Auth from "../utils/Auth";
import PopupAvatar from "./PopupAvatar";
import PopupProfile from "./PopupProfile";
import PopupPlace from "./PopupPlace";
import PopupDelete from "./PopupDelete";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import successImage from "../images/Unionfirst.png";
import failImage from "../images/Union.png";

function App() {
  const [isPopupPlaceOpen, setPopupPlaceOpen] = React.useState(false);
  const [isPopupAvatarOpen, setIsPopupAvatarOpen] = React.useState(false);
  const [isPopupProfileOpen, setIsPopupProfileOpen] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({ isOpen: false });
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [infoTooltipData, setInfoTooltipData] = useState({ isSuccess: false, message: '' });
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();




  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      Auth
        .checkToken(token)
        .then((data) => {
          setEmail(data);
          setLoggedIn(true);
        })
        .catch(console.error);
    }
  }, [navigate]);


  React.useEffect(() => {
    api
      .getUserInfo()
      .then((result) =>{ 
        setCurrentUser(result);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }, []);

  function handleCardClick(card) {
    setSelectedCard({
      isOpen: true,
      name: card.name,
      link: card.link,
    });
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .setLike(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        console.log(card._id);
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(`Ошибка при удалении карточки: ${err}`));
  }

  function closeAllPopups() {
    setPopupPlaceOpen(false);
    setIsPopupAvatarOpen(false);
    setIsPopupProfileOpen(false);
    setSelectedCard({ isOpen: false });
    setInfoTooltipOpen(false);

  }
  function onEditAvatar() {
    setIsPopupAvatarOpen(true);
  }
  function onEditProfile() {
    setIsPopupProfileOpen(true);
  }
  function onAddPlace() {
    setPopupPlaceOpen(true);
  }
  function handleUpdateUser(name, description) {
    api
      .editUserInfo(name, description)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err} in editUserAvatar`));
  }
  function handleUpdateAvatar(avatar) {
    api
      .editAvatar({ url: avatar })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err} in editUserAvatar`));
  }
  function handleAddPlaceSubmit(name, link) {
    api
      .addCard({ name: name, link: link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })

      .catch((err) => console.log(`Error ${err} in addCard`));
  }
  function handleLogin() {
    setLoggedIn(true);
  }
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setCurrentUser({});
    return <Navigate to="/signin" replace />;
  };
  return (
    <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            path={loggedIn ? '/' : '/sign-in'}
            userEmail={currentUser.email}
            onLogout={handleLogout}
            loggedIn={loggedIn}
          />
          <Routes>
            <Route path="/sign-in" element={<Login setInfoTooltipData={setInfoTooltipData} setInfoTooltipOpen={setInfoTooltipOpen}/>} />
            <Route path="/sign-up" element={<Register setInfoTooltipData={setInfoTooltipData} setInfoTooltipOpen={setInfoTooltipOpen} />} /> 
            <Route path="/" element={ <ProtectedRoute
                    component={Main}
                          onEditAvatar={onEditAvatar}
                          onEditProfile={onEditProfile}
                          onAddPlace={onAddPlace}
                          onCardClick={handleCardClick}
                          cards={cards}
                          onCardLike={handleCardLike}
                          onCardDelete={handleCardDelete}
                          email={email}
                          loggedIn={loggedIn}
                  />
              }
            />
            <Route path="*" element={loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />} />
          </Routes>

          <Footer />

          <PopupAvatar
            isOpen={isPopupAvatarOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <PopupProfile
            isOpen={isPopupProfileOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <PopupPlace
            isOpen={isPopupPlaceOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <ImagePopup
            cardLink={selectedCard.link}
            cardName={selectedCard.name}
            onClose={closeAllPopups}
            isOpen={selectedCard.isOpen}
          />
          <PopupDelete />

          <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          status={infoTooltipData}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}



export default App;
