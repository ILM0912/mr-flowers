import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "../src/styles/index.css";
import "../src/styles/variables.css";

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import { Provider, useDispatch } from 'react-redux';
import store, { AppDispatch } from './store';
import { setCart } from './store/CartSlice';
import { refreshUser } from './store/AuthSlice';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const localCart = sessionStorage.getItem('cart');
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');

    if (userData.email) {
      dispatch(refreshUser(userData.email));
    } else if (localCart) {
      dispatch(setCart(JSON.parse(localCart)));
    } else {
      dispatch(setCart([]));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
