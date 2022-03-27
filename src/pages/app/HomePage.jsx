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
import MedicoService from "../../service/MedicoService";
import EmergenciaCard from "../../components/EmergenciaCard";
import TabelaAgendamentoMedico from './../../components/TabelaAgendamentoMedico';
import DialogQuestionariosPaciente from './../../components/DialogQuestionariosPaciente';
import AtendenteService from './../../service/AtendenteService';
import { StorageService } from "../../service/StorageService";
import { LoginService, setUserPerfilSelected } from "../../service/LoginService";
import TabelaAgendamentoAtendente from "../../components/TabelaAgendamentoAtendente";
import FormBuscaPaciente from "../../components/FormBuscaPaciente";


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
    /** instancia MedicoService */
    const medicoService = new MedicoService();
    /** instancia AtendenteService */
    const atendenteService = new AtendenteService();

    const [myEnderecos, setMyEnderecos] = useState(null);
    const [selectedEndereco, setSelectedEndereco] = useState(null);
    const [displayDialogEndereco, setDisplayDialogEndereco] = useState(false);
    const [loadingEnderecos, setLoadingEnderecos] = useState(false);
    const [atendenteFindedPaciente, setAtendenteFindedPaciente] = useState(null);

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
                setUserPerfilSelected(perfil);
                setPerfilSelected(perfil);
                loadActionsByPerfil(perfil.tipo, perfil.id);
            }
            return perfil;
        });
        setDisplayBasic(false)
    }
    /** AQUI SE CARREGAR OS DADOS DE EXIBIÇÃO ENTRE OS PERFIS */
    const loadActionsByPerfil = (tipo = null, id = null) => { 
        switch (tipo) {
            case 'paciente':
                const metricasPaciente = pacienteService.getMetrics(context.token, id || context.perfilSelected?.id);
                metricasPaciente.then(metricas => { 
                    setMetrics(metricas);
                    changeMenuPerfil('paciente');
                })
                break;
            case 'medico':
                const metricasMedico = medicoService.getMetrics(context.token, id || context.perfilSelected?.id);
                metricasMedico.then(metricas => { 
                    setMetrics(metricas);
                    changeMenuPerfil('medico');
                })
                break;
            case 'atendente':
                const metricasAtendente = atendenteService.getMetrics(context.token);
                metricasAtendente.then(metricas => { 
                    setMetrics(metricas);
                    changeMenuPerfil('atendente');
                })
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
            setLoadingEnderecos(false);
        });

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
                            <h4 className="align-self-center text-900">{usuarioLogado?.nome}</h4>
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
                    <div className="col-12 md:col-6 lg:col-6 xl:col-4">
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
                    <div className="col-12 md:col-6 lg:col-6 xl:col-4">
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
                    <div className="col-12 md:col-6 lg:col-6 xl:col-4">
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
                    <div className="col-12 md:col-6 lg:col-6 xl:col-4">
                        <div className="card mb-0">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3 text-lg text-primary">Permissões</span>
                                    <div className="text-900 font-medium text-xl">{0}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                    <i className="pi pi-map-marker text-orange-500 text-xl" />
                                </div>
                            </div>
                            {
                                loadingMetrics ?
                                <span className="text-500 text-center"><em>Carregando</em></span>
                                : <>{
                                    null ? 
                                    <span className="text-500">Último atendimento: { metrics?.historicos?.ultimo.split('-',3).reverse().join('/')}</span>
                                    :
                                    <span className="text-500">Nenhum usuário tem acesso a conta encontrado.</span>
                                    }</>
                            }
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-4">
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
                                                return <Button label="Agendado" type="button" className="p-button-outlined" />
                                            case '1':
                                            case 'na_espera':
                                                /** Na espera */
                                                return <Button label="Na espera" type="button" className="p-button-warning" />
                                            case '2':
                                            case 'em_realizacao':
                                                /** Em realização */
                                                return <Button label="Em realização" type="button" className="p-button-secondary" />
                                            case '3':
                                            case 'realizado':
                                                /** Realizado */
                                                return <Button label="Realizado" type="button" className="p-button-outlined p-button-success" />
                                            case '4':
                                            case 'nao_realizado':
                                                /** Não realizado */
                                                return <Button label="Não realizado" type="button" className="p-button-outlined p-button-danger" />
                                            case 'emergencia':
                                                return <Button label="Emergência" icon="" type="button" className="p-button-danger" />
                                            default:
                                                /** Desconhecido */
                                                return <Button label="Desconhecido" type="button" className="p-button-text" />
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
                (perfilSelected?.tipo === 'medico' &&
                <div className="grid">
                    {(loadingMetrics && <h5 className="text-center">Carregando...</h5> ) || null}        

                    {(!loadingMetrics && metrics?.minhas_emergencias && metrics?.minhas_emergencias?.length &&
                        <div className="col-12">
                            <div className="grid">
                                <div className="col-12 mb-0">
                                    <h2 className="text-pink-700 mb-0">Minhas Emergências</h2>
                                </div>
                            {
                                (
                                    metrics?.minhas_emergencias.map((emergencia) => {
                                        return <EmergenciaCard emergencia={emergencia} key={emergencia.id} token={context.token}/>
                                    })
                                ) || ( !loadingMetrics &&
                                    <h5>Você não possuí nenhuma emergência</h5>
                                )
                            }
                            </div>
                        </div>
                    ) || null}
                    {(!loadingMetrics && metrics?.outras_emergencias && metrics?.outras_emergencias?.length && 
                        <div className="col-12">
                            <div className="grid">
                                <div className="col-12 mb-0">
                                    <h2 className="text-pink-700 mb-0">Outras Emergências</h2>
                                </div>
                            {
                                (
                                    metrics?.outras_emergencias.map((emergencia) => {
                                        return <EmergenciaCard emergencia={emergencia} key={emergencia.id} token={context.token}/>
                                    })
                                ) || ( !loadingMetrics &&
                                    <h5>Não existe nenhuma emergência no estabelecimento.</h5>
                                )
                            }
                            </div>
                        </div>
                    ) || null}
                    {(!loadingMetrics && metrics?.agendamentos && metrics?.agendamentos?.length && 
                        <div className="col-12">
                            <div className="grid">
                                <div className="col-12 mb-0">
                                    <h2 className="text-pink-700 mb-0">Agendamento de Consultas:</h2>
                                </div>
                            {
                                (
                                    metrics?.agendamentos && 
                                    <TabelaAgendamentoMedico agendamentos={metrics?.agendamentos}/>
                                ) || ( !loadingMetrics &&
                                    <h5>Você não possuí agendamentos para os próximos dias.</h5>
                                )
                            }
                            </div>
                        </div>
                    )||null}
                    {/* {/* <DialogQuestionariosPaciente token={context.token} paciente_id={ } tipo={ } show={ } }); */}
                </div>
                )|| null   
            }
            {/* MÉDICO - FIM */}
            {/* ATENDENTE */}
            {
                perfilSelected?.tipo === 'atendente' &&
                <div className="grid">
                    <FormBuscaPaciente token={context.token} setPacienteEncontrado={setAtendenteFindedPaciente}/>
                    <div className="col-12">
                        <div className="card mb-0 border-indigo-200 hover:border-indigo-300 border-3 border-round surface-overlay font-bold block align-items-center bg-indigo-50">
                            <h4 className="">Emergências :</h4>
                            {(loadingMetrics && <h5 className="text-center">Carregando...</h5>) || null}
                            {(!loadingMetrics && metrics?.emergencias && metrics?.emergencias?.length && 
                                <TabelaAgendamentoAtendente token={context.token} service={atendenteService} agendamentos={metrics?.emergencias}/>
                            ) || null}
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card mb-0 border-indigo-200 hover:border-indigo-300 border-3 border-round surface-overlay font-bold block align-items-center bg-indigo-50">
                            <h4 className="">Agendamentos :</h4>
                            {(loadingMetrics && <h5 className="text-center">Carregando...</h5>) || null}
                            {(!loadingMetrics && metrics?.agendamentos && metrics?.agendamentos?.length && 
                                <TabelaAgendamentoAtendente token={context.token} service={atendenteService} agendamentos={metrics?.agendamentos}/>
                            ) || null}
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card mb-0 border-indigo-200 hover:border-indigo-300 border-3 border-round surface-overlay font-bold block align-items-center bg-indigo-50">
                            <h4 className="">Paciente na Espera :</h4>
                            {(loadingMetrics && <h5 className="text-center">Carregando...</h5>) || null}
                            {(!loadingMetrics && metrics?.paciente_na_espera && metrics?.paciente_na_espera?.length && 
                                <TabelaAgendamentoAtendente token={context.token} service={atendenteService} agendamentos={metrics?.paciente_na_espera}/>
                            ) || null}
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card mb-0 border-indigo-200 hover:border-indigo-300 border-3 border-round surface-overlay font-bold block align-items-center bg-indigo-50">
                            <h4 className="">Pacientes em Procedimento :</h4>
                            {(loadingMetrics && <h5 className="text-center">Carregando...</h5>) || null}
                            {(!loadingMetrics && metrics?.paciente_em_procedimento && metrics?.paciente_em_procedimento?.length && 
                                <TabelaAgendamentoAtendente token={context.token} service={atendenteService} agendamentos={metrics?.paciente_em_procedimento}/>
                            ) || null}
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
            {(perfilSelected?.tipo === 'admin' &&
                <><h2 className="text-indigo-600">Métricas de BI</h2>
                <iframe title="HMV - Dashboard - Questionário de Emergência" width="100%" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiOGE3ZTZmNDEtYjUxMS00ZjkzLTkzMmEtYzU0YTViM2U1MzhiIiwidCI6ImJjOThlYTcyLTdjYzAtNDI4OC1hODI1LTUyMDNiZDdmYTI5YSJ9" frameborder="0" allowFullScreen="true"></iframe>
                </>
            ) || null
            }
            {/* ADMIN - FIM*/}
        </>
    );
};

export default HomePage;
