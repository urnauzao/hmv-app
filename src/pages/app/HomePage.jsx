import React, { useState, useEffect, useContext } from "react";
import { Avatar } from "primereact/avatar";
import { AgendamentoService } from "./../../service/AgendamentoService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { authContext } from "./../../App";
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';

const HomePage = () => {
    const [agendamentos, setAgendamentos] = useState(null);
    const context = useContext(authContext);
    const usuarioLogado = context.user;
    /** setar perfil selecionado */
    const [perfilSelected, setPerfilSelected] = useState(context.perfilSelected || context.user?.perfis[0]);
    /** mostrar ou não a modal para alteração de perfil */
    const [displayBasic, setDisplayBasic] = useState(false);
    /** select perfil */
    const [radioSelectedPefil, setRadioSelectedPerfil] = useState(perfilSelected?.tipo);
    

    useEffect(() => {
        const agendamentoService = new AgendamentoService();
        agendamentoService.getAgendamentos().then((data) => setAgendamentos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, style: "currency", currency: "BRL" });
    };

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
                            <Avatar className="p-overlay-badge mr-3" image={usuarioLogado.foto} size="xlarge"></Avatar>
                            <h4 className="align-self-center mb-">{usuarioLogado.nome}</h4>
                        </div>
                        <p className="mb-0 p-panel-header">
                            Perfil: {(perfilSelected?.tipo || " ? ").toUpperCase()}
                            <Dialog header="Alterar Perfil" visible={displayBasic} style={{ width: '30vw' }} modal footer={dialogChangePerfilFooter} onHide={() => setDisplayBasic(false)}>
                                <div className="grid py-2">
                                    <div className="col-12">
                                        <p>Selecione o perfil de conta que deseja acessar:</p>
                                    </div>
                                    {
                                        Array.isArray(usuarioLogado.perfis) && usuarioLogado.perfis.length > 0 ? usuarioLogado.perfis.map((perfil) => { 
                                            let string  = perfil.tipo.charAt(0).toUpperCase() + perfil.tipo.slice(1)
                                            return(
                                                <div className="col-12 md:col-4" key={string}>
                                                    <div className="field-radiobutton">
                                                        <RadioButton inputId={"option-"+perfil.tipo} name="option" value={perfil.tipo} checked={radioSelectedPefil === perfil.tipo} onChange={(e) => setRadioSelectedPerfil(e.value)} />
                                                        <label htmlFor={"option-"+perfil.tipo}>{string}</label>
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
                        {/* <span className="text-green-500 font-medium">24 new </span> */}
                        <span className="text-500">Último questionário: 12/01/2022</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Histórico de Atendimento</span>
                                <div className="text-900 font-medium text-xl">12</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                <i className="pi pi-map-marker text-orange-500 text-xl" />
                            </div>
                        </div>
                        {/* <span className="text-green-500 font-medium">%52+ </span> */}
                        <span className="text-500">Último antendimento: 10/12/2021</span>
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
                        {/* <span className="text-green-500 font-medium">520  </span> */}
                        <span className="text-500">Atualizado em 02/09/2021</span>
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
                        {/* <span className="text-green-500 font-medium">85 </span> */}
                        <span className="text-500">Atualizado em {usuarioLogado?.updated_at.split('T',1).join().split('-',3).reverse().join('/')}</span>
                    </div>
                </div>
            </div>
            <div className="grid mt-1">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Últimas Consultas</h5>
                        <DataTable value={agendamentos} rows={5} paginator responsiveLayout="scroll">
                            <Column header="Image" body={(data) => <img className="shadow-2" src={`assets/demo/images/product/${data.image}`} alt={data.image} width="50" />} />
                            <Column field="name" header="Name" sortable style={{ width: "35%" }} />
                            <Column field="price" header="Price" sortable style={{ width: "35%" }} body={(data) => formatCurrency(data.price)} />
                            <Column
                                header="View"
                                style={{ width: "15%" }}
                                body={() => (
                                    <>
                                        <Button icon="pi pi-search" type="button" className="p-button-text" />
                                    </>
                                )}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

// export default React.memo(HomePage, comparisonFn);
export default HomePage;
