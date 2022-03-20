import React, { useState, useEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { authContext } from "../../App";

const LoginPage = ({ props }) => {
    let navigate = useNavigate();
    const location = useLocation();
    const [usuario, setUsuario] = useState();
    const [senha, setSenha] = useState();
    // const auth = props();
    const context = useContext(authContext);
    const [isLoged, setIsLoged] = useState(context.isLoged);
    const history = useNavigate();
    const [loadingLogin, setLoadingLogin] = useState(false);

    const login = () => {
        setLoadingLogin(true);
        context.signin(usuario, senha, navigator.userAgent);
    };

    useEffect(() => {
        console.log({ isLoged });
        if (isLoged === true) {
            console.log("redirecionou");
            return navigate('/');
            // setTimeout(() => navigate('/'), 3000)
        }
    }, [isLoged, context.isLoged]);

    // if (isLoged || context.isLoged) { 
    //     setTimeout(() => navigate('/'), 3000)
    // }

    return (
        <div className="grid">
            <ToastContainer />
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
                                <InputText placeholder="E-mail de usuário" onChange={(e) => setUsuario(e.target.value)} />
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
                            <Button
                                label="Acessar"
                                icon="pi pi-check"
                                loading={loadingLogin}
                                onClick={login}
                            />
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
                                <InputText placeholder="E-mail de usuário" />
                            </div>
                            <h5 className="text-secondary">Digite uma senha para seu usuário:</h5>
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Senha de acesso" onChange={(e) => console.log("password", e.target.value)} feedback={false} />
                            </div>
                            <h5 className="text-secondary">Repita a senha para seu usuário:</h5>
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password placeholder="Repita sua senha" onChange={(e) => console.log("password", e.target.value)} feedback={false} />
                            </div>
                        </div>
                    </div>
                    <div className="fluid mt-3">
                        <div className="flex flex-row-reverse flex-wrap card-container">
                            <Button
                                label="Criar Usuário"
                                icon="pi pi-check"
                                // loading={loading}
                                // onClick={onLoadingClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
