import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { authContext } from "./../../App";
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import PacienteService from './../../service/PacienteService';
import { Link } from "react-router-dom";
import { Chip } from 'primereact/chip';
import { Dropdown } from 'primereact/dropdown';
import EnderecoService from './../../service/EnderecoService';
import { Toast } from 'primereact/toast';


const HomePage = ({ changeMenuPerfil }) => {
    // const [agendamentos, setAgendamentos] = useState(null);
    const context = useContext(authContext);
    /** armazena o usuário logado a partir do contexto */
    const usuarioLogado = context.user;
    /** setar perfil selecionado */
    const [perfilSelected, setPerfilSelected] = useState(null);
    /** mostrar ou não a modal para alteração de perfil */
    const [displayBasic, setDisplayBasic] = useState(false);
    /** select perfil */
    const [radioSelectedPefil, setRadioSelectedPerfil] = useState();
    /** metricas de usuário */
    const [metrics, setMetrics] = useState([]);
    /** utilizado para saber se há algo sendo carregado na tela */
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    /** instancia PacienteService */
    const pacienteService = new PacienteService();

    const [myEnderecos, setMyEnderecos] = useState(null);
    const [selectedEndereco, setSelectedEndereco] = useState(null);
    const [displayDialogEndereco, setDisplayDialogEndereco] = useState(false);
    const [loadingEnderecos, setLoadingEnderecos] = useState(false);

    const toast = useRef();

    const cardBgColors = {
        'paciente': 'blue',
        'medico': 'green',
        'atendente': 'yellow',
        'socorrista': 'pink',
        'admin': 'teal'
    };

    useEffect(() => {
        console.log('useEffectHomePage', context)
        if (context.perfilSelected) {
            setPerfilSelected(context.perfilSelected)
            setRadioSelectedPerfil(context.perfilSelected.tipo)
            loadActionsByPerfil(context?.perfilSelected?.tipo)
        }

    }, []);

    useEffect(() => {
        if (typeof metrics === typeof {} && Object.keys(metrics).length > 0) {
            setLoadingMetrics(false);
        }
    }, [metrics]);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, style: "currency", currency: "BRL" });
    // };
    
    const formatDate = (value) => { 
        try {
            return value.split('T',1).join().split('-',3).reverse().join('/')
        } catch (error) {
            return "Data desconhecida.";
        }
    }
    const dialogChangePerfilFooter = <Button type="button" label="Salvar" onClick={() => chagePerfil() } icon="pi pi-check" className="p-button-secondary" />;
    
    const chagePerfil = () => {
        setLoadingMetrics(true);
        usuarioLogado.perfis.map((perfil) => {
            if (perfil.tipo === radioSelectedPefil) {
                context.setPerilSelected(perfil)
                setPerfilSelected(perfil);
                loadActionsByPerfil(perfil.tipo, perfil.id);
            }
        });
        setDisplayBasic(false)
    }

    const loadActionsByPerfil = (tipo = null, id = null) => { 
        switch (tipo) {
            case 'paciente':
                const metricas = pacienteService.getMetrics(context.token, id || context.perfilSelected?.id);
                metricas.then(metricas => { 
                    setMetrics(metricas);
                    changeMenuPerfil('paciente');
                })
                break;
            case 'medico':
                console.log("chamando changeMenuPerfil");
                changeMenuPerfil('medico');
                break;
            default:
                console.warn('Default não configurado', context.perfilSelected.tipo)
                break;
        }
    }

    const fnChamarEmergencia = () => { 
        setLoadingEnderecos(true);
        const service = new PacienteService()
        service.postChamadoEmergencia(context.token, perfilSelected.id, { ...selectedEndereco }).then(
            (result) => {
                console.log(result)
                setLoadingEnderecos(false);
                showSuccessChamadoEmergencia();
            }
        );
        setDisplayDialogEndereco(false);
    }

    const fnSelecionarEnderecoEmergencia = () => { 
        setLoadingEnderecos(true);
        const meusEnderecos = new EnderecoService();
        meusEnderecos.getMyAll(context.token).then((result) => { 
            if (Array.isArray(result)) { 
                const resultados = [];
                for (const res of result) { 
                    resultados.push({
                        ...res,
                        name: res?.nome + " | " + res?.logradouro + ", " + res.numero,
                        code: res.id
                    })
                }
                if (resultados) { 
                    setMyEnderecos(resultados);
                    setSelectedEndereco(resultados[0])
                }
                setDisplayDialogEndereco(true);
            }
        });
        setLoadingEnderecos(false);

    }
    const btnDialogChamadoEmergencia = <Button type="button" loading={loadingEnderecos} className="p-button" label="Chamar Agora!" onClick={fnChamarEmergencia} />

    const showSuccessChamadoEmergencia = () => {
        toast.current.show({ severity: 'success', summary: 'Chamado de Emergência Realizado!', detail: 'Em minutos nossa equipe está se deslocando até você para realizar o atendimento.', life: 7000 });
    };
    return (
        <>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-6 xl:col-6 mb-3">
                    <div className={"card mb-0 bg-"+cardBgColors[perfilSelected?.tipo]+"-100 border-" + cardBgColors[perfilSelected?.tipo] + "-800 border-3"}>
                        <div className="flex">
                            <Avatar className="p-overlay-badge mr-3" image={usuarioLogado?.foto} size="xlarge"></Avatar>
                            <h4 className="align-self-center mb-">{usuarioLogado?.nome}</h4>
                        </div>
                        <div className="flex p-column-filter-buttonbar">
                            <Chip className="bg-white shadow-2 text-primary" label={(perfilSelected?.tipo || " ? ").toUpperCase()} />
                            <Button type="button" label="Alterar Perfil" icon="pi pi-external-link" onClick={() => setDisplayBasic(true)} />
                        </div>
                        <p className="mb-0 p-panel-header align-items-center">
                            <Dialog header="Alterar Perfil" visible={displayBasic} style={{ width: '30vw' }} modal footer={dialogChangePerfilFooter} onHide={() => setDisplayBasic(false)}>
                                <div className="grid py-2">
                                    <div className="col-12">
                                        <p>Selecione o perfil de conta que deseja acessar:</p>
                                    </div>
                                    {
                                        Array.isArray(usuarioLogado?.perfis) && usuarioLogado?.perfis.length > 0 ? usuarioLogado?.perfis.map((perfil) => { 
                                            let string  = perfil?.tipo?.charAt(0)?.toUpperCase() + perfil?.tipo?.slice(1)
                                            return(
                                                <div className="col-12 md:col-4" key={string}>
                                                    <div className="field-radiobutton">
                                                        <RadioButton inputId={"option-"+perfil?.tipo} name="option" value={perfil?.tipo} checked={radioSelectedPefil === perfil?.tipo} onChange={(e) => setRadioSelectedPerfil(e.value)} />
                                                        <label htmlFor={"option-"+perfil?.tipo}>{string}</label>
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                        <p>Atualize a página e tente novamente</p>
                                    }
                                </div>
                            </Dialog>
                        </p>
                    </div>
                </div>
                {
                    perfilSelected?.tipo === 'paciente' &&
                    <div className="col-12 lg:col-6 xl:col-6">
                        <div className="card mb-0 border-pink-700 hover:border-pink-900 border-3 border-round font-bold flex align-items-center bg-pink-100">
                            <div className="flex justify-content-center w-full">
                                <div className="text-center flex">
                                    <p className="text-center mb-0">
                                        <span className="block text-center text-500 lg:text-2xl xl:text-3xl font-medium text-lg text-pink-900">Está passando mal ou<br/> precisando de socorro?</span>
                                    </p>
                                    <Button type="button" loading={loadingEnderecos} onClick={fnSelecionarEnderecoEmergencia} label="Chamar Socorro Agora!" className="p-button-danger align-self-center text-dark mx-3"/>
                                </div>
                            </div>
                        </div>
                        <Dialog header="Chamar Emergência!" visible={displayDialogEndereco} style={{ width: '60vw' }} modal footer={btnDialogChamadoEmergencia} onHide={() => setDisplayDialogEndereco(false)}>
                            <p className="mb-0">
                                Selecione seu endereço para que nossa equipe chegue até seu local para realizar o atendimento de urgência.
                            </p>
                                <h5>Onde você está agora?</h5>
                                <Dropdown value={selectedEndereco} onChange={(e) => setSelectedEndereco(e.value)} options={myEnderecos} optionLabel="name" placeholder="Select" />
                        </Dialog>
                        <Toast ref={toast} />
                    </div>
                }
            </div>
            {/* PACIENTE */}
            {
                perfilSelected?.tipo === 'paciente' &&
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">Questionário de Emergência</span>
                                    <Link to="/questionario-emergencia">
                                        <Button type="button" label="Criar novo" className="p-button-outlined" icon="pi pi-star-fill" />
                                    </Link>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-pink-600 text-xl" />
                                </div>
                            </div>
                            {
                                loadingMetrics ?
                                <span className="text-500 text-center"><em>Carregando</em></span>
                                : <>{
                                metrics?.questionarios_emergencia?.total > 0 ? 
                                    <span className="text-500">Último questionário: { metrics?.questionarios_emergencia?.ultimo.split('-',3).reverse().join('/')}</span>
                                :
                                    <span className="text-500">Nenhum questionário encontrado.</span>
                                }</>
                            }
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">Histórico de Atendimento</span>
                                    <div className="text-900 font-medium text-xl">{metrics?.historicos?.total || 0}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-map-marker text-orange-500 text-xl" />
                                </div>
                            </div>
                            {
                                loadingMetrics ?
                                <span className="text-500 text-center"><em>Carregando</em></span>
                                : <>{
                                metrics?.historicos?.total > 0 ? 
                                    <span className="text-500">Último atendimento: { metrics?.historicos?.ultimo.split('-',3).reverse().join('/')}</span>
                                :
                                    <span className="text-500">Nenhum atendimento encontrado.</span>
                                    }</>
                            }
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">Hábitos de Saúde</span>
                                    <Link to="/habitos">
                                        <Button type="button" label="Novo Hábito" className="p-button-outlined" icon="pi pi-star-fill" />
                                    </Link>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-heart-fill text-cyan-500 text-xl" />
                                </div>
                            </div>
                            {
                                loadingMetrics ?
                                <span className="text-500 text-center"><em>Carregando</em></span>
                                : <>{
                                metrics?.habitos?.total > 0 ? 
                                    <span className="text-500">Último atendimento: { metrics?.habitos?.ultimo?.split('-',3).reverse().join('/')}</span>
                                :
                                    <span className="text-500">Você ainda não informou seus hábitos.</span>
                                    }</>
                            }
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-3">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">Meus Dados</span>
                                    <div className="text-900 font-medium text-xl">Atualizar Dados</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-save text-purple-500 text-xl" />
                                </div>
                            </div>
                            <span className="text-500">Atualizado em {usuarioLogado?.updated_at.split('T',1).join().split('-',3).reverse().join('/')}</span>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card">
                            <h5>Últimas Consultas</h5>
                            <DataTable value={metrics?.agendamentos?.lista} rows={5} paginator responsiveLayout="scroll" loading={loadingMetrics} sortField='data' sortOrder='-1'>
                                <Column header="Imagem" body={(data) => <img className="shadow-2 w-11rem" src={data.estabelecimento.imagem} alt={data.estabelecimento.nome} />} />
                                <Column field="estabelecimento.nome" header="Nome" sortable style={{ width: "35%" }} />
                                <Column field="data" header="Data" sortable style={{ width: "20%" }} body={(data) => formatDate(data.data)} />
                                <Column
                                    header="Situação"
                                    style={{ width: "20%" }}
                                    body={(data) => {
                                        switch(data.situacao){ 
                                            case '0':
                                            case 'agendado':
                                                /** Agendado */
                                                return <Button label="Agendado" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '1':
                                            case 'na_espera':
                                                /** Na espera */
                                                return <Button label="Na espera" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '2':
                                            case 'em_realizacao':
                                                /** Em realização */
                                                return <Button label="Em realização" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '3':
                                            case 'realizado':
                                                /** Realizado */
                                                return <Button label="Realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '4':
                                            case 'nao_realizado':
                                                /** Não realizado */
                                                return <Button label="Não realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                            case 'emergencia':
                                                return <Button label="Chamado de Emergência" icon="" type="button" className="p-button-danger" />
                                            default:
                                                /** Desconhecido */
                                                return <Button label="Desconhecido" icon="pi pi-search" type="button" className="p-button-text" />
                                        }
                                    }}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            }
            {/* PACIENTE - FIM*/}
            {/* MÉDICO */}
            {
                perfilSelected?.tipo === 'medico' &&
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0 border-pink-700 hover:border-pink-900 border-3 border-round font-bold flex align-items-center bg-pink-100">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                <p>
                                    <span className="block text-500 text-4xl font-medium mb-3 text-lg text-pink-600">Emergência!</span>
                                </p>
                                    <h4 className="align-items-center flex"><Avatar size="xlarge" className="mx-2" image={"/images/avatar/stephenshaw.png"}/>NOME DO PACIENTE</h4>
                                    <Button type="button" label="Quest. Emergência" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Habitos de Saúde" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Histórico" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Concluir Atendimento" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />    
                                </div>
                                <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-pink-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                <p>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">Último Paciente</span>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">01/01/2022 às 10:00h</span>
                                </p>
                                    <h4 className="align-items-center flex"><Avatar size="xlarge" className="mx-2" image={"/images/avatar/stephenshaw.png"}/>NOME DO PACIENTE</h4>
                                    <Button type="button" label="Quest. Emergência" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Habitos de Saúde" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Histórico" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Concluir Atendimento" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />    
                                </div>
                                <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-pink-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <p>
                                        <span className="block text-500 font-medium mb-3 text-lg text-primary">Próximo Paciente</span>
                                        <span className="block text-500 font-medium mb-3 text-lg text-primary">01/01/2022 às 10:00h</span>
                                        <b className="text-pink-700">OBS:</b>
                                    </p>
                                    <h4 className="align-items-center flex"><Avatar size="xlarge" className="mx-2" image={"/images/avatar/asiyajavayant.png"}/>NOME DO PACIENTE</h4>
                                    <Button type="button" label="Quest. Emergência" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Habitos de Saúde" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Histórico" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                                    <Button type="button" label="Concluir Atendimento" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />    
                                </div>
                                <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-pink-600 text-xl" />
                                </div>
                            </div>
                                

                            <p className="mb-0 p-panel-header align-items-center">
                                <Dialog header="Alterar Perfil" visible={displayBasic} style={{ width: '30vw' }} modal footer={dialogChangePerfilFooter} onHide={() => setDisplayBasic(false)}>
                                    <div className="grid py-2">
                                        <div className="col-12">
                                            <p>Selecione o perfil de conta que deseja acessar:</p>
                                        </div>
                                        {
                                            Array.isArray(usuarioLogado?.perfis) && usuarioLogado?.perfis.length > 0 ? usuarioLogado?.perfis.map((perfil) => { 
                                                let string  = perfil?.tipo?.charAt(0)?.toUpperCase() + perfil?.tipo?.slice(1)
                                                return(
                                                    <div className="col-12 md:col-4" key={string}>
                                                        <div className="field-radiobutton">
                                                            <RadioButton inputId={"option-"+perfil?.tipo} name="option" value={perfil?.tipo} checked={radioSelectedPefil === perfil?.tipo} onChange={(e) => setRadioSelectedPerfil(e.value)} />
                                                            <label htmlFor={"option-"+perfil?.tipo}>{string}</label>
                                                        </div>
                                                    </div>
                                                )
                                            }) :
                                            <p>Atualize a página e tente novamente</p>
                                        }
                                    </div>
                                </Dialog>
                            </p>
                        </div>
                    </div>
                    {true===false &&
                    <div className="col-12">
                        <div className="card">
                            <h5>Próximas Consultas:</h5>
                            <DataTable value={metrics?.agendamentos?.lista} rows={5} paginator responsiveLayout="scroll" loading={loadingMetrics} sortField='data' sortOrder='-1'>
                                <Column header="Local" body={(data) => <img className="shadow-2 w-full" src={data.estabelecimento.imagem} alt={data.estabelecimento.nome} />} />
                                <Column field="estabelecimento.nome" header="Paciente" sortable style={{ width: "35%" }} />
                                <Column field="data" header="Data" sortable style={{ width: "20%" }} body={(data) => formatDate(data.data)} />
                                <Column
                                    header="Situação"
                                    style={{ width: "20%" }}
                                    body={(data) => {
                                        switch(data.situacao){ 
                                            case '0':
                                                /** Agendado */
                                                return <Button label="Agendado" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '1':
                                                /** Na espera */
                                                return <Button label="Na espera" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '2':
                                                /** Em realização */
                                                return <Button label="Em realização" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '3':
                                                /** Realizado */
                                                return <Button label="Realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                            case '4':
                                                /** Não realizado */
                                                return <Button label="Não realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                            default:
                                                /** Desconhecido */
                                                return <Button label="Desconhecido" icon="pi pi-search" type="button" className="p-button-text" />
                                        }
                                    }}
                                />
                            </DataTable>
                        </div>
                    </div>
                    }    
                </div>
            }
            {/* MÉDICO - FIM */}
            {/* ATENDENTE */}
            {
                perfilSelected?.tipo === 'atendente' &&
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0 border-pink-200 hover:border-pink-300 border-3 border-round surface-overlay font-bold flex align-items-center bg-pink-100">
                            <div className="flex justify-content-between mb-3 w-full">
                                <div>
                                    <p>
                                        <span className="block text-500 text-4xl font-medium mb-3 text-lg text-pink-600">Emergência!</span>
                                    </p>
                                    <Button type="button" label="Nova Emergência" className="m-1 p-button-danger" icon="pi pi-star-fill" />
                                </div>
                                <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-pink-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0 border-blue-200 hover:border-blue-300 border-3 border-round surface-overlay font-bold flex align-items-center bg-blue-100">
                            <div className="flex justify-content-between mb-3 w-full">
                                <div>
                                <p>
                                    <span className="block text-500 text-4xl font-medium mb-3 text-lg text-blue-600">Questionário de Emergência!</span>
                                </p>
                                    <Button type="button" label="Novo Questionário" className="m-1" icon="pi pi-star-fill" />
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-blue-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0 border-indigo-200 hover:border-indigo-300 border-3 border-round surface-overlay font-bold flex align-items-center bg-indigo-100">
                            <div className="flex justify-content-between mb-3 w-full">
                                <div>
                                <p>
                                    <span className="block text-500 text-4xl font-medium mb-3 text-lg text-indigo-600">Agendar Consulta</span>
                                </p>
                                    <Button type="button" label="Nova Consulta" className="m-1" icon="pi pi-star-fill" />
                                </div>
                                <div className="flex align-items-center justify-content-center bg-indigo-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-indigo-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* ATENDENTE - FIM */}
            {/* SOCORRISTA */}
            {
                perfilSelected?.tipo === 'socorrista' &&
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-4">
                        <div className="card mb-0 border-blue-200 hover:border-blue-300 border-3 border-round surface-overlay font-bold flex align-items-center bg-blue-100">
                            <div className="flex justify-content-between mb-3 w-full">
                                <div>
                                <p>
                                    <span className="block text-500 text-4xl font-medium mb-3 text-lg text-blue-600">Questionário de Emergência!</span>
                                </p>
                                    <Button type="button" label="Novo Questionário" className="m-1" icon="pi pi-star-fill" />
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-question-circle text-blue-600 text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* SOCORRISTA - FIM */}
            {/* ADMIN */}
            {perfilSelected?.tipo === 'admin' &&
                <iframe title="HMV - BI - Página 1"
                    width="600" height="373.5"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZWYxMGM4ZDYtYmU4ZC00YzNlLTlkNmQtNzZhMzczYjA1YzVlIiwidCI6ImJjOThlYTcyLTdjYzAtNDI4OC1hODI1LTUyMDNiZDdmYTI5YSJ9"
                    frameborder="0"
                    allowFullScreen="true">
                </iframe>
            }
            {/* ADMIN - FIM*/}
        </>
    );
};

export default HomePage;
