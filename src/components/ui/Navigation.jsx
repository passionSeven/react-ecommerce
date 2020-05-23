import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter, NavLink, Link} from 'react-router-dom';
import BasketToggle from '../basket/BasketToggle';
import Badge from './Badge';
import UserAvatar from 'views/account/components/UserAvatar';
import SearchBar from './SearchBar';
import FiltersToggle from './FiltersToggle';
import MobileNavigation from './MobileNavigation';

import logo from '../../../static/logo_horizontal.png';
import * as ROUTE from 'constants/routes';

const Navigation = ({ isAuth, path, history }) => {
  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);

    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);
  
  const { store } = useSelector(state => ({
    store: {
      filter: state.filter,
      products: state.products.items,
      basketLength: state.basket.length,
      profile: state.profile,
      isLoading: state.app.loading,
      isAuthenticating: state.app.isAuthenticating,
      productsLength: state.products.items.length
    }
  }));
  const navbar = useRef(null);

  const scrollHandler = () => {
    if (navbar.current && window.screen.width > 480) {
      if (window.pageYOffset >= 70) {
        navbar.current.classList.add('is-nav-scrolled');
      } else {
        navbar.current.classList.remove('is-nav-scrolled');
      }
    }
  };

  const onClickLink = (e) => {
    if (store.isAuthenticating) e.preventDefault();
  };

  // disable the basket toggle to these paths
  const basketDisabledPaths = [
    ROUTE.CHECKOUT_STEP_1, 
    ROUTE.CHECKOUT_STEP_2, 
    ROUTE.CHECKOUT_STEP_3,
    ROUTE.SIGNIN,
    ROUTE.SIGNUP,
    ROUTE.FORGOT_PASSWORD
  ];

  return window.screen.width <= 480 ? (
    <MobileNavigation 
        basketLength={store.basketLength}
        profile={store.profile}
        isAuth={isAuth}
        isAuthenticating={store.isAuthenticating}
        path={path} 
        disabledPaths={basketDisabledPaths} 
    />
  ) : (
    <nav 
        className="navigation"
        ref={navbar}
    >
      <div className="logo">
        <Link onClick={onClickLink} to="/">
          <img src={logo} />
        </Link>
      </div>
      {path === ROUTE.HOME && (
        <>
          <SearchBar 
              isLoading={store.isLoading}
              filter={store.filter}
              history={history}
              productsLength={store.productsLength}
          />
          &nbsp;
          <FiltersToggle
              filter={store.filter}
              isLoading={store.isLoading}
              products={store.products}
              productsLength={store.productsLength}
              history={history}
          >
            <button className="button-muted button-small">
              More Filters &nbsp;<i className="fa fa-chevron-right" />
            </button>
          </FiltersToggle>
        </>
      )}
      <ul className="navigation-menu">
        <li className="navigation-menu-item">
          <BasketToggle>
            {({ onClickToggle }) => (
              <button 
                  className="button-link navigation-menu-link basket-toggle" 
                  disabled={basketDisabledPaths.includes(path)}
                  onClick={onClickToggle}
              >
                
                <Badge count={store.basketLength}>
                  <i className="fa fa-shopping-basket" style={{  fontSize: '2rem'}}/>
                </Badge>
              </button>
            )}
          </BasketToggle>
        </li>
        {isAuth ? (
          <li className="navigation-menu-item">
            <UserAvatar isAuthenticating={store.isAuthenticating} profile={store.profile} />
          </li>
        ) : (
          <li className="navigation-action">
            {(path === ROUTE.SIGNIN || path === ROUTE.HOME) && (
              <NavLink 
                  activeClassName="navigation-menu-active"
                  className="button button-small"
                  exact
                  onClick={onClickLink}
                  to={ROUTE.SIGNUP} 
              >
                Sign Up
              </NavLink>
            )}
            {(path === ROUTE.SIGNUP || path === ROUTE.FORGOT_PASSWORD || path === ROUTE.HOME) && (
                <NavLink 
                    activeClassName="navigation-menu-active"
                    className="button button-small button-muted margin-left-s"
                    exact
                    onClick={onClickLink}
                    to={ROUTE.SIGNIN} 
                >
                  Sign In
                </NavLink>
            )}
          </li>
        )} 
      </ul>
    </nav>
  );
};

export default withRouter(Navigation);
