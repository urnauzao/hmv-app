import React, { useState, useEffect, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../App";
import { Chip } from "primereact/chip";
import { Image } from 'primereact/image';

const LoginPage = ({ props }) => {
    const context = useContext(authContext);
    let navigate = useNavigate();
    const [usuario, setUsuario] = useState();
    const [senha, setSenha] = useState();
    const [isLoged, setIsLoged] = useState(context.isLoged);
    const [loadingLogin, setLoadingLogin] = useState(false);

    const login = () => {
        setLoadingLogin(true);
        context.signin(usuario, senha, navigator.userAgent);
    };

    useEffect(() => {
        if (isLoged === true) {
            console.log("redirecionou");
            return navigate('/');
        }
    }, [isLoged, context.isLoged]);


    return (
        <div className="grid">
            <ToastContainer />
            <div className="col-12">
                <div className="card text-center">
                    <h2 className="text-center text-blue-700">Connect HMV</h2>
                    <Link title="Acessar página inicial do HMV!" to="https://www.hospitalmoinhos.org.br/" className="px-2">
                        <Image width="200" className="text-center w-2rem" src="/images/hmv/logo.png" alt="Connect HMV" />
                    </Link>
                    <div>
                        <Link title="Acessar YouTube do HMV!" to="https://www.youtube.com/user/HospitalMoinhos" className="px-2">
                            <i className="pi pi-youtube text-blue-800 text-5xl"/>
                        </Link>
                        <Link title="Acessar Instagram do HMV!" to="https://www.instagram.com/hospitalmoinhosdevento/" className="px-2">
                            <i className="pi pi-instagram text-blue-800 text-5xl"/>
                        </Link>
                        <Link title="Acessar Facebook do HMV!" to="https://www.facebook.com/HospitalMoinhos" className="px-2">
                            <i className="pi pi-facebook text-blue-800 text-5xl"/>
                        </Link>
                        <Link title="Acessar Linkedin do HMV" to="https://www.linkedin.com/company/hospital-moinhos-de-vento/" className="px-2">
                            <i className="pi pi-linkedin text-blue-800 text-5xl"/>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <div className="flex align-items-center flex-wrap">
                        <Chip label="Já sou cadastrado!" className="mr-2 mb-2 bg-indigo-500 text-4xl text-white" />
                    </div>
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
                    <div className="flex align-items-center flex-wrap">
                        <Chip label="Sou novo por aqui!" className="mr-2 mb-2 bg-purple-400 text-4xl text-white" />
                    </div>
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
                                className="p-button-help"
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
