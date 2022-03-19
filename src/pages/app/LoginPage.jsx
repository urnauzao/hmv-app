import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { LoginService } from './../../service/LoginService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect, useHistory, useLocation } from 'react-router-dom';


const LoginPage = ({ props }) => {
    // const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState();
    const [senha, setSenha] = useState();
    // const [redirectToReferrer, setRedirectToReferrer] = React.useState(LoginService.isLoged()||false);
    let history = useHistory();
    let location = useLocation();
    let auth = props();
    // useAuth();

    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
        // auth.signin((usuario, senha, device_name = "?") => {
        //     history.replace(from);
        // });
        auth.signin(usuario, senha, navigator.userAgent);
    };

    // return (
    //     <div>
    //     <p>You must log in to view the page at {from.pathname}</p>
    //     <button onClick={login}>Log in</button>
    //     </div>
    // );



    // const onLoadingClick = () => {
    //     setLoading(true);
    // }

    // const login = async () => {
    //     setLoading(true);
    //     const loginService = new LoginService();
    //     const result = await loginService.postLogin(usuario, senha, navigator.userAgent)
    //     if (result.success) {
    //         console.log("setandosucesso", LoginService.isLoged())
    //         setRedirectToReferrer(true);
    //     } else {
    //         toast.error(result.message)
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     console.log('loginService', LoginService.isLoged());
    //     return () => {
    //         if (redirectToReferrer === true) {
    //             return <Redirect to="/" />;
    //         }
    //     };
    // }, [redirectToReferrer]);
   

    return (
        <div className="grid">
            <ToastContainer/>
            <div className="col-12">
                <div className="card">
                    <h2>Área de Login</h2>
                </div>
            </div>
            
            <div className="col-12 md:col-6">
                <div className="card">
                    <h2 className="my-3">Área de Login</h2>
                    <h3 className="text-primary text-center">Já sou cadastrado!</h3>
                    <div className="grid p-fluid">
                        <div className="col-12 py-3">
                            <h5 className="text-secondary">Digite seu e-mail de usuário:</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="E-mail de usuário" onChange={(e) => setUsuario(e.target.value)}/>
                            </div>
                            <h5 className="text-secondary">Digite sua senha:</h5>
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Senha de acesso" onChange={(e) => setSenha(e.target.value)} feedback={false} />
                            </div>
                        </div>
                    </div>
                    <div className="fluid mt-3">
                        <div className="flex flex-row-reverse flex-wrap card-container">
                            <Button label="Acessar" icon="pi pi-check"
                                // loading={loading}
                            onClick={login} />
                            <p className="align-self-center px-2">Esqueci a senha</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="card">
                    <h3 className="text-primary text-center">Sou novo por aqui!</h3>
                    <div className="grid p-fluid">
                        <div className="col-12 py-3">
                            <h5 className="text-secondary">Digite um e-mail para seu usuário:</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText placeholder="E-mail de usuário"/>
                            </div>
                            <h5 className="text-secondary">Digite uma senha para seu usuário:</h5>
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Senha de acesso" onChange={(e) => console.log('password',e.target.value)} feedback={false} />
                            </div>
                            <h5 className="text-secondary">Repita a senha para seu usuário:</h5>
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Repita sua senha" onChange={(e) => console.log('password',e.target.value)} feedback={false} />
                            </div>
                        </div>
                    </div>
                    <div className="fluid mt-3">
                        <div className="flex flex-row-reverse flex-wrap card-container">
                            <Button label="Criar Usuário" icon="pi pi-check"
                                // loading={loading}
                                // onClick={onLoadingClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

// export default React.memo(LoginPage, comparisonFn);
export default LoginPage;
