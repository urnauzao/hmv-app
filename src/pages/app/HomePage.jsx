import React, { useState, useEffect, useContext } from "react";
import { Avatar } from "primereact/avatar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { authContext } from "./../../App";
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import PacienteService from './../../service/PacienteService';


const HomePage = () => {
    // const [agendamentos, setAgendamentos] = useState(null);
    const context = useContext(authContext);
    /** armazena o usuário logado a partir do contexto */
    const usuarioLogado = context.user;
    /** setar perfil selecionado */
    const [perfilSelected, setPerfilSelected] = useState(context.perfilSelected || context.user?.perfis[0]);
    /** mostrar ou não a modal para alteração de perfil */
    const [displayBasic, setDisplayBasic] = useState(false);
    /** select perfil */
    const [radioSelectedPefil, setRadioSelectedPerfil] = useState(perfilSelected?.tipo);
    /** metricas de usuário */
    const [metrics, setMetrics] = useState([]);
    /** utilizado para saber se há algo sendo carregado na tela */
    const [loadingMetrics, setLoadingMetrics] = useState(false);
    /** instancia PacienteService */
    const pacienteService = new PacienteService();


    useEffect(() => {
        setLoadingMetrics(true);
        console.log('HomePage::UseEffect::perfilSelected');
        switch (perfilSelected?.tipo) {
            case 'paciente':
                const metricas = pacienteService.getMetrics(context?.token, perfilSelected.id);
                metricas.then(metricas => { 
                    setMetrics(metricas);
                    console.log({ metricas });
                    setLoadingMetrics(false);
                })
                break;
            default:
                console.warn('Default não configurado', perfilSelected?.tipo)
        }
    }, [ perfilSelected ]);

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
        usuarioLogado.perfis.map((perfil) => {
            if (perfil.tipo === radioSelectedPefil) {
                context.setPerilSelected(perfil)
                setPerfilSelected(perfil);
            }
        });
        setDisplayBasic(false)
    }

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex">
                            <Avatar className="p-overlay-badge mr-3" image={usuarioLogado?.foto} size="xlarge"></Avatar>
                            <h4 className="align-self-center mb-">{usuarioLogado?.nome}</h4>
                        </div>
                        <p className="mb-0 p-panel-header">
                            Perfil: {(perfilSelected?.tipo || " ? ").toUpperCase()}
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
                            <Button type="button" label="Alterar Perfil" icon="pi pi-external-link" onClick={() => setDisplayBasic(true)} />
                        </p>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Questionário de Emergência</span>
                                <div className="text-900 font-medium text-xl">Criar novo</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                <i className="pi pi-question-circle text-blue-500 text-xl" />
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
                                <span className="block text-500 font-medium mb-3">Histórico de Atendimento</span>
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
                                <span className="block text-500 font-medium mb-3">Hábitos de Saúde</span>
                                <div className="text-900 font-medium text-xl">Atualizar Hábitos</div>
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
                                <span className="block text-500 font-medium mb-3">Meus Dados</span>
                                <div className="text-900 font-medium text-xl">Atualizar Dados</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                <i className="pi pi-save text-purple-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Atualizado em {usuarioLogado?.updated_at.split('T',1).join().split('-',3).reverse().join('/')}</span>
                    </div>
                </div>
            </div>
            <div className="grid mt-1">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Últimas Consultas</h5>
                        <DataTable value={metrics?.agendamentos?.lista} rows={5} paginator responsiveLayout="scroll" loading={loadingMetrics} sortField='data' sortOrder='-1'>
                            <Column header="Imagem" body={(data) => <img className="shadow-2 w-full" src={data.estabelecimento.imagem} alt={data.estabelecimento.nome} />} />
                            <Column field="estabelecimento.nome" header="Nome" sortable style={{ width: "35%" }} />
                            <Column field="data" header="Data" sortable style={{ width: "20%" }} body={(data) => formatDate(data.data)} />
                            <Column
                                header="Situação"
                                style={{ width: "20%" }}
                                body={(data) => {
                                    switch(data.situacao){ 
                                        case '0':
                                            return <Button label="Agendado" icon="pi pi-search" type="button" className="p-button-text" />
                                        case '1':
                                            return <Button label="Na espera" icon="pi pi-search" type="button" className="p-button-text" />
                                        case '2':
                                            return <Button label="Em realização" icon="pi pi-search" type="button" className="p-button-text" />
                                        case '3':
                                            return <Button label="Realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                        case '4':
                                            return <Button label="Não realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                        default:
                                            return <Button label="Desconhecido" icon="pi pi-search" type="button" className="p-button-text" />
                                    }
                                }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
