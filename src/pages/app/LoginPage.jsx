import React, { useState, useEffect, useContext, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../App";
import { Chip } from "primereact/chip";
import { Image } from 'primereact/image';
import { newUserModel, LoginService } from "../../service/LoginService";
import { InputMask } from 'primereact/inputmask';
import { Panel } from 'primereact/panel';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from "primereact/dropdown";
import { Toast } from 'primereact/toast';


const service = new LoginService();

const LoginPage = ({ props }) => {
    const context = useContext(authContext);
    let navigate = useNavigate();
    const [usuario, setUsuario] = useState();
    const [senha, setSenha] = useState();
    const [isLoged, setIsLoged] = useState(context.isLoged);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [newUser, setNewUser] = useState(null);
    const [registered, setRegistered] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const toast = useRef();

    const login = () => {
        setLoadingLogin(true);
        context.signin(usuario, senha, navigator.userAgent).then((x) => {
            console.log(x);
            if (x && x?.status === false) {
                toast.current.show({ severity: 'error', summary: 'Não foi possível realizar o login!', detail: x?.mensagem||"-", life: 7000 });
            }
            setLoadingLogin(false);
        });
    };

    useEffect(() => {
        if (isLoged === true) {
            console.log("redirecionou");
            return navigate('/');
        }
    }, [isLoged, context.isLoged]);

    const createUser = () => { 
        setNewUser({ ...newUserModel });
    }

    const estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO", "DF"
    ]

    const changeUser = (campo = "", valor = "") => { 
        const __usuario = { ...newUser };
        switch (campo) {
            case "email":
                __usuario[campo] = valor;
            break;
            case "password":
                __usuario[campo] = valor;
            break;
            case "doc_tipo":
                __usuario[campo] = valor?.toLowerCase();
            break;
            case "doc_numero":
                __usuario[campo] = valor;
            break;
            case "foto":
                __usuario[campo] = valor;
            break;
            case "nome":
                __usuario[campo] = valor;
            break;
            case "end_nome":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_tipo":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_logradouro":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_cep":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_numero":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_cidade":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_estado":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            case "end_complemento":
                __usuario['endereco'][campo.split("_")[1]] = valor;
            break;
            default:
                break;
        }
        setNewUser(__usuario);
    }

    const registerNow = () => {
        setLoadingRegister(true);
        for (const keyUser in newUser) { 
            const intoUser = newUser[keyUser];
            if (["foto"].includes(keyUser)) { 
                continue;
            }else if (intoUser === "") { 
                toast.current.show({ severity: 'error', summary: 'Erro ao salvar novo usuário!', detail: 'Existem campos do usuário que não foram informados.[Campo '+keyUser+'].', life: 7000 });
                setLoadingRegister(false);
                return;
            }
            console.log(keyUser)
            if (keyUser === "endereco") { 
                for (const keyEnd in newUser[keyUser]) { 
                    const intoEnd = newUser[keyUser][keyEnd];
                    if (["complemento", "numero"].includes(keyEnd)) { 
                        continue;
                    } else if (intoEnd === "") {
                        toast.current.show({ severity: 'error', summary: 'Erro ao salvar novo usuário!', detail: 'Existem campos de endereço do usuário que não foram informados. [Campo endereço '+keyEnd+'].', life: 7000 });
                        setLoadingRegister(false);
                        return;
                    }
                }
            }
        }
        service.register(newUser).then((result) => { 
            if (!result) { 
                setLoadingRegister(false);
                toast.current.show({ severity: 'error', summary: 'Erro ao salvar novo usuário!', detail: 'Tente realizar novamente a operação.', life: 7000 });
                return;
            }
            toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Parabens, usuário criado com!', life: 7000 });
            setRegistered(true);
            setLoadingRegister(false);
        })

    };

    return (
        <div className="grid">
            <Toast ref={toast} />
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
                                <InputText name="email" placeholder="E-mail de usuário"disabled={loadingLogin} onChange={(e) => setUsuario(e.target.value)} />
                            </div>
                            <h5 className="text-secondary">Digite sua senha:</h5>
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-key"></i>
                                </span>
                                <Password name="password" placeholder="Senha de acesso" disabled={loadingLogin} onChange={(e) => setSenha(e.target.value)} feedback={false} />
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
                { !registered ?
                    <div className="card">
                    <div className="flex align-items-center flex-wrap">
                        <Chip label="Sou novo por aqui!" className="mr-2 mb-2 bg-purple-300 text-4xl text-white" />
                    </div>
                    <p>Crie você um usuário agora mesmo e comece a agendar suas consultas em qualque hospital da rede HMV.
                        Para criar seu usuário clique no botão abaixo em "Quero me registrar" e então informe todos os dados solicitados.
                        Depois de criado, você já pode acessar seu portal de paciente e com isso conseguir visulizar suas consultas ou solicitar uma emergência.
                    </p>
                    {
                        newUser ?
                            <>
                                <Panel header="Informações Gerais">
                                    <div className="grid p-fluid">
                                        <div className="col-12 py-3">
                                            {/* EMAIL */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEmail" className="text-indigo-700 my-2">Digite um e-mail:</h5>
                                                        <InputText id="newUserEmail" disabled={loadingRegister}  value={newUser?.email} placeholder="Digite aqui seu e-mail."
                                                        onChange={(e) => {
                                                            changeUser('email', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* PASSWORD */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserPassword" className="text-indigo-700 my-2">Digite uma senha:</h5>
                                                    <Password id="newUserPassword" disabled={loadingRegister} value={newUser?.password} placeholder="Digite uma senha para acessar ao sistema."
                                                        onChange={(e) => {
                                                            changeUser('password', e.target.value)
                                                        }}
                                                        toggleMask
                                                    />
                                                </div>
                                            </div>
                                            {/* CPF ou CNPJ */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserDocTipo" className="text-indigo-700 my-2">Clique para alternar entre CPF ou CNPJ:</h5>
                                                    <div className="grid m-0">
                                                        <div className="col-12 md:col-4 m-0" >
                                                            <div className="field-radiobutton">
                                                                <RadioButton disabled={loadingRegister} className="m-0" inputId="optionCPF" name="doc_tipo" value="cpf" checked={newUser?.doc_tipo === 'cpf'} onChange={(e) => changeUser('doc_tipo', e.value)} />
                                                                <h5 className="my-0" htmlFor="optionCPF">CPF</h5>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4 m-0">
                                                            <div className="field-radiobutton">
                                                                <RadioButton disabled={loadingRegister} className="m-0" inputId="optionCNPJ" name="doc_tipo" value="cnpj" checked={newUser?.doc_tipo === 'cnpj'} onChange={(e) => changeUser('doc_tipo', e.value)} />
                                                                <h5 className="my-0" htmlFor="optionCNPJ">CNPJ</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* NUMERO DO DOCUMENTO */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    {newUser?.doc_tipo === "cpf" ?
                                                        <>
                                                            <h5 htmlFor="newUserCPF" className="text-indigo-700 my-2">Digite seu CPF:</h5>
                                                            <InputMask id="newUserCPF" disabled={loadingRegister} mask="999.999.999-99" value={newUser?.doc_numero}
                                                                onChange={(e) => {
                                                                    changeUser('doc_numero', e.value)
                                                                }}
                                                            />
                                                        </>
                                                        :
                                                        <>
                                                            <h5 htmlFor="newUserCNPJ" className="text-indigo-700 my-2">Digite seu CNPJ:</h5>
                                                            <InputMask id="newUserCNPJ" disabled={loadingRegister} mask="99.999.999/9999-99" value={newUser?.doc_numero}
                                                                onChange={(e) => {
                                                                    changeUser('doc_numero', e.value)
                                                                }}
                                                            />
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                            {/* FOTO */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserFoto" className="text-indigo-700 my-2">Digite um link de uma foto sua:</h5>
                                                    <InputText id="newUserFoto" disabled={loadingRegister} maxLength={200} value={newUser?.foto} placeholder="Insira o link de uma imagem sua na internet."
                                                        onChange={(e) => {
                                                            changeUser('foto', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* NOME */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserNome" className="text-indigo-700 my-2">Digite seu nome:</h5>
                                                    <InputText id="newUserNome" disabled={loadingRegister} maxLength={60} value={newUser?.nome} placeholder="Informe seu nome completo aqui."
                                                        onChange={(e) => {
                                                            changeUser('nome', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                                <Panel className="mt-3" header="Informações de Endereço">
                                    <div className="grid p-fluid">
                                        <div className="col-12 py-3">
                                            {/* ENDERECO NOME */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndNome" className="text-indigo-700 my-2">Nome para o Endereço:</h5>
                                                    <InputText id="newUserEndNome" disabled={loadingRegister} value={newUser?.endereco.nome} placeholder="Ex: Casa, Empresa, Vizinho..."
                                                        onChange={(e) => {
                                                            changeUser('end_nome', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* ENDERECO NOME*/}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndTipo" className="text-indigo-700 my-2">Tipo:</h5>
                                                    <InputText id="newUserEndTipo" disabled={loadingRegister} value={newUser?.endereco.tipo} placeholder="Rua, Avenida, Esquina..."
                                                        onChange={(e) => {
                                                            changeUser('end_tipo', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* ENDERECO LOGRADOURO */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndLogradouro" className="text-indigo-700 my-2">Logradouro:</h5>
                                                    <InputText id="newUserEndLogradouro" disabled={loadingRegister} value={newUser?.endereco.logradouro} placeholder="Digite o nome de logradourado."
                                                        onChange={(e) => {
                                                            changeUser('end_logradouro', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* CEP */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndCEP" className="text-indigo-700 my-2">CEP:</h5>
                                                    <InputMask id="newUserEndCEP" disabled={loadingRegister} mask="99999-999" value={newUser?.endereco.cep}
                                                        onChange={(e) => {
                                                            changeUser('end_cep', e.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* ENDERECO NUMERO */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndNumero" className="text-indigo-700 my-2">Número da Residência:</h5>
                                                    <InputText id="newUserEndNumero" disabled={loadingRegister} value={newUser?.endereco.numero} maxLength={8} placeholder="Número."
                                                        onChange={(e) => {
                                                            changeUser('end_numero', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* ENDERECO CIDADE */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndCidade" className="text-indigo-700 my-2">Cidade:</h5>
                                                    <InputText id="newUserEndCidade" disabled={loadingRegister} value={newUser?.endereco.cidade} maxLength={60} placeholder="Cidade."
                                                        onChange={(e) => {
                                                            changeUser('end_cidade', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* ENDERECO ESTADO */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndCidade" className="text-indigo-700 my-2">Estado:</h5>
                                                    <Dropdown id="newUserEndCidade" disabled={loadingRegister} value={newUser?.endereco.estado} onChange={(e) => changeUser('end_estado', e.value)}
                                                        options={estados} placeholder="Selecione um endereço!"></Dropdown>
                                                </div>
                                            </div>
                                            {/* ENDERECO COMPLEMENTO */}
                                            <div className="formgroup-inline">
                                                <div className="field">
                                                    <h5 htmlFor="newUserEndComplemento" className="text-indigo-700 my-2">Complemento:</h5>
                                                    <InputText id="newUserEndComplemento" disabled={loadingRegister} value={newUser?.endereco.complemento} maxLength={20} placeholder="Complemento do endereço."
                                                        onChange={(e) => {
                                                            changeUser('end_complemento', e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                                    <Button className="p-button my-2 w-full" loading={loadingRegister} label="Criar usuário!" onClick={registerNow} />
                            </>
                            : <Button className="p-button-help" label="Quero me registrar!" onClick={createUser} />
                    }
                    </div>
                    :
                    <div className="card">
                        <h2>Parabéns, você agora está registrado e já pode fazer login para acessar com seu novo usuário.</h2>
                    </div>
                }
            </div>
        </div>
    );
};

export default LoginPage;
