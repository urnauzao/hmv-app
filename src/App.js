import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import classNames from 'classnames';
import { Route, useLocation, Routes, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';
import  HomePage from './pages/app/HomePage'; 

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import LoginPage from './pages/app/LoginPage';
import { getToken, getUserPerfilSelected, getUsersMe, isLoged as fnIsLoged, LoginService } from './service/LoginService';
import HabitoSaudePage from './pages/app/HabitoSaudePage';
import QuestionarioEmergenciaPage from './pages/app/QuestionarioEmergenciaPage';
import { TipoMenuService } from './service/TipoMenuService';

export const authContext = createContext();

const App = () => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const [menu, setMenu] = useState(TipoMenuService.menuPaciente);

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
        
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }



    const changeMenuPerfil = (tipo = null) => { 
        console.log({ tipo });
        switch (tipo) {
            case 'medico':
                setMenu(TipoMenuService.menuMedico);
                break;
            default:
                setMenu(TipoMenuService.menuPaciente);
                break;
        }
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <ProvideAuth>
            <div className={wrapperClass} onClick={onWrapperClick}>
                <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
                {
                    location.pathname !== '/login' &&
                    <>
                        <AppTopbar
                            onToggleMenuClick={onToggleMenuClick}
                            layoutColorMode={layoutColorMode}
                            mobileTopbarMenuActive={mobileTopbarMenuActive}
                            onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                            onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
                            auth={useAuth}
                        />
                        <div className="layout-sidebar" onClick={onSidebarClick}>
                            <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} auth={useAuth}/>
                        </div>
                    </>
                }
                    
                <div className={location.pathname !== '/login' ? "layout-main-container" : "py-3 px-8"}>
                    <div className="layout-main">
                        <Routes>
                            <Route path="/login" element={ 
                                <LoginPage props={useAuth} />
                            }/>
                            <Route exact path='/' element={
                                <PrivateRoute >
                                    <HomePage changeMenuPerfil={changeMenuPerfil}/>
                                </PrivateRoute>    
                            }/>
                            <Route path='/habitos' element={ 
                                <PrivateRoute>
                                    <HabitoSaudePage />
                                </PrivateRoute>
                            }/>
                            <Route path='/questionario-emergencia' element={
                                <PrivateRoute>
                                    <QuestionarioEmergenciaPage />
                                </PrivateRoute>
                            } />
                            <Route path="*" element={<Navigate to="/login" replace/>} />
                        </Routes>
                    </div>

                    <AppFooter layoutColorMode={layoutColorMode} />
                </div>

                <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                    layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

                <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                    <div className="layout-mask p-component-overlay"></div>
                </CSSTransition>

            </div>
        </ProvideAuth >
    );

}

export default App;

const ProvideAuth = ({ children }) => {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

const useAuth = () => {
    return useContext(authContext);
}

const useProvideAuth = () => {
    const [user, setUser] = useState(getUsersMe());
    const [perfilSelected, setPerilSelected] = useState(getUserPerfilSelected());
    const [token, setToken] = useState(getToken());
    const [isLoged, setIsLoged] = useState(fnIsLoged());
    const history = useNavigate();

    console.log("useProvideAuth", user, isLoged);
    const signin = async (email, senha, device_name, cb) => {
        let loginService = new LoginService();
        let newToken = await loginService.postLogin(email, senha, device_name);
        let user = await loginService.getMe(getToken());
        if (fnIsLoged()) {
            setUser(user);
            setPerilSelected(user?.perfis?.find((x) => { return x?.tipo === 'paciente'} ));
            setToken(newToken);
            setIsLoged(true);
            console.log('está logado', isLoged);
            history("/", true);
        }
    };

    const signout = () => {
        console.log('saindo');
        let loginService = new LoginService();
        loginService.logout();
        setUser(null);
        setPerilSelected(null);
        setToken(null);
        setIsLoged(false);
        history("/login", true);
    };

    return {
        isLoged,
        token,
        user,
        perfilSelected,
        setPerilSelected,
        signin,
        signout
    };
}

// A wrapper for <Route> that redirects to the login, screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
        auth.isLoged ? 
            children :
            <Navigate to="/login" replace />
    );
}