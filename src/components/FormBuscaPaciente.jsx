import React, { useState, useRef } from "react";
import { Button } from 'primereact/button';
import { mascaraCNPJ, mascaraCPF } from "../service/MascarasCpfCnpjService";
import AtendenteService from './../service/AtendenteService';
import { InputText } from "primereact/inputtext";
import { Avatar } from 'primereact/avatar';
import { Dropdown } from "primereact/dropdown";
import { mascaraData, mascaraHora } from "../service/MascarasDataHoraService";
import { Dialog } from "primereact/dialog";
import { Toast } from 'primereact/toast';

const service = new AtendenteService();

const FormBuscaPaciente = ({ token, setPacienteEncontrado }) => {

    const [cpf, setCPF] = useState("");
    const [cnpj, setCNPJ] = useState("");
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [loading, setLoading] = useState(false);
    const [paciente, setPaciente] = useState(null);
    const [pacienteNaoEncontrado, setPacienteNaoEncontrado] = useState(false);
    const [selectedEndereco, setSelectedEndereco] = useState(null);
    const [selectedEstabelecimento, setSelectedEstabelecimento] = useState(null);
    const [showNewAgendamento, setShowNewAgendamento] = useState(false);
    const [loadingEnvioNewAgendamento, setLoadingEnvioNewAgendamento] = useState(false);
    const [isEmergencia, setIsEmergencia] = useState(false);
    const toast = useRef();

    const [newAgendExame, setNewAgendExame] = useState("Emergência!");
    const [newAgendObs, setNewAgendObs] = useState("");

    

    const validateCPF = (e) => { 
        if (cnpj) {
            setCNPJ("");
        }
        setCPF(mascaraCPF(e.target.value || ""));
    }

    const validateCNPJ = (e) => { 
        if(cpf){
            setCPF("");
        }
        setCNPJ(mascaraCNPJ(e.target.value || ""));
    }
    const validateHora = (e) => { 
        setHora(mascaraHora(e.target.value || ""));
    }

    const validateData = (e) => { 
        setData(mascaraData(e.target.value || ""));
    }

    const buscar = () => { 
        setLoading(true);
        setPacienteNaoEncontrado(null);
        let tipo = null;
        if (cpf)
            tipo = "cpf";
        else if (cnpj)
            tipo = "cnpj";
        else {
            setLoading(false);
            setPacienteNaoEncontrado(true);
            return;
        }

        service.postPacienteByDoc(token, {
            doc_tipo: tipo,
            doc_numero: cpf || cnpj
        }).then((result) => {
            if (result == null) { 
                setPacienteNaoEncontrado(true);
                setSelectedEndereco(null);
            } else {
                setPacienteEncontrado(result);
                setPaciente(result);
                setSelectedEndereco(result?.enderecos[0])
            }
            setLoading(false);
        }).catch(() => { 
            setPacienteNaoEncontrado(true);
            setSelectedEndereco(null);
        });
    }

    const criarAgendamento = () => { 
        setLoadingEnvioNewAgendamento(true);
        const body = {};
        if(data && hora)
        body.data = data + " " + hora;
        body.situacao = isEmergencia ? "emergencia" : "agendado";
        body.observacoes = newAgendObs;
        body.exame = newAgendExame;
        body.estabelecimento_id = selectedEstabelecimento.id;
        body.local_paciente_id = selectedEndereco.id;
        service.postAgendamentoNovo(token, paciente.perfil_id, body).then((result) => { 
            setLoadingEnvioNewAgendamento(false);
            if (!result) { 
                toast.current.show({ severity: 'error', summary: isEmergencia?'Erro ao Salvar Emergência!' : 'Erro ao Salvar Agendamento!', detail: 'Tente realizar novamente a operação.', life: 7000 });
                return;
            }
            toast.current.show({ severity: 'success', summary: isEmergencia ? 'Emergência Salva!' : 'Agendamento Salvo!', detail: 'Tudo certo!', life: 7000 });
            setIsEmergencia(false);
        })
    }

    const showAndSetEmergencia = () => { 
        setIsEmergencia(true);
        setShowNewAgendamento(true);
    }

    const footerNewAgendamento = <Button type="button" loading={loadingEnvioNewAgendamento} className="p-button" label="Salvar!" onClick={criarAgendamento} />

    return (
        <div className="col-12 lg:col-12">
             <Toast ref={toast} />
            <div className="card mb-0 border-pink-200 hover:border-pink-300 border-3 border-round surface-overlay font-bold align-items-center bg-pink-100">
                <h3 className="text-indigo-600">Encontrar Paciente:</h3>
                <div className="grid">
                    <div className="formgroup-inline">
                        <div className="field">
                            <label htmlFor="cpf" className="text-indigo-700">Buscar por CPF:</label>
                            <InputText id="cpf" value={cpf} placeholder="010.020.030-40"onChange={validateCPF}/>    
                        </div>
                        <div className="field">
                            <label htmlFor="cnpj" className="text-indigo-700">Buscar por CNPJ:</label>
                            <InputText id="cnpj" value={cnpj} placeholder="10.100.100/1000-20" onChange={validateCNPJ}/>
                        </div>
                        <Button label="Buscar" className="btn btn-primary" onClick={buscar} loading={loading} />
                    </div>
                </div>
                { pacienteNaoEncontrado && <h4 className="text-pink-600">Paciente não encontrado. Tente novamente.</h4>}
                {
                    (
                    paciente &&
                    <div className="block w-full">
                        <h4 className="mt-4 text-indigo-700">Paciente Encontrado(a):</h4>
                        <Avatar size="xlarge" image={ paciente?.foto}/>
                        <p className="text-600">
                            Nome: <span className="text-900">{paciente?.nome}</span><br/>
                            Tipo Documento: <span className="text-900">{paciente?.doc_tipo}</span><br/>
                            Número Documento: <span className="text-900">{paciente?.doc_numero}</span><br/>
                            E-mail: <span className="text-900">{paciente?.email}</span><br />
                            Código Paciente: <span className="text-900">{paciente?.perfil_id}</span>
                        </p>
                        <div className="formgroup-inline">
                            <div className="field">
                                <label htmlFor="enderecoPaciente" className="text-indigo-700">Endereço do Paciente:</label>
                                <Dropdown id="enderecoPaciente" value={selectedEndereco} onChange={(e) => setSelectedEndereco(e.value)} options={paciente?.enderecos} optionLabel="nome" placeholder="Selecione um endereço!"></Dropdown>
                            </div>
                        </div>
                        <Dialog header={isEmergencia ? "Nova Emergência!" : "Novo Agendamento!"} visible={showNewAgendamento} style={{ width: '60vw' }} modal footer={footerNewAgendamento} onHide={() => { setShowNewAgendamento(false);  setIsEmergencia(false)}}>
                            {!isEmergencia ? <><div className="formgroup-inline">
                                <div className="field">
                                    <label htmlFor="dataEmergencia" className="text-indigo-700">Dia da Consulta:</label>
                                    <InputText id="dataEmergencia" value={data} placeholder="Ano-Mes-Dia. Ex: 2022-02-27" onChange={validateData}/>    
                                </div>
                            </div>
                            <div className="formgroup-inline">
                                <div className="field">
                                    <label htmlFor="horaEmergencia" className="text-indigo-700">Hora da Consulta:</label>
                                    <InputText id="horaEmergencia" value={hora} placeholder="Hora-Minuto-Segundo. Ex: 14:00:00" onChange={validateHora}/>    
                                </div>
                            </div></>: null}
                            <div className="formgroup-inline">
                                <div className="field">
                                    <label htmlFor="exameEmergencia" className="text-indigo-700">Exame:</label>
                                    <InputText id="exameEmergencia" value={newAgendExame} placeholder="Emergência" onChange={(e) => setNewAgendExame(e.target.value)}/>    
                                </div>
                            </div>
                            <div className="formgroup-inline">
                                <div className="field">
                                    <label htmlFor="obsEmergencia" className="text-indigo-700">Observações:</label>
                                    <InputText id="obsEmergencia" value={newAgendObs} placeholder="Digite uma observação para este atendimento." onChange={(e) => setNewAgendObs(e.target.value)}/>    
                                </div>
                            </div>
                            <div className="formgroup-inline">
                                <div className="field">
                                    <label htmlFor="estabelecimentoEmergencia" className="text-indigo-700">Estabelecimento:</label>
                                    <Dropdown id="estabelecimentoEmergencia" value={selectedEstabelecimento} onChange={(e) => setSelectedEstabelecimento(e.value)} options={paciente?.estabelecimentos} optionLabel="nome" placeholder="Selecione um estabelecimento!"></Dropdown>
                                </div>
                            </div>
                        </Dialog>        
                                
                        <div className="grid">
                            <div className="col-12 lg:col-6 xl:col-4">
                                <div className="card mb-0 border-pink-200 hover:border-pink-300 border-3 border-round surface-overlay font-bold flex align-items-center bg-pink-100">
                                    <div className="flex justify-content-between mb-3 w-full">
                                        <div>
                                            <p>
                                                <span className="block text-500 text-4xl font-medium mb-3 text-lg text-pink-600">Emergência!</span>
                                            </p>
                                            <Button type="button" label="Nova Emergência" onClick={showAndSetEmergencia} className="m-1 p-button-danger" icon="pi pi-star-fill" />
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
                                        <Button type="button" label="Nova Consulta" onClick={()=> setShowNewAgendamento(true)} className="m-1" icon="pi pi-star-fill" />
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-indigo-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                            <i className="pi pi-question-circle text-indigo-600 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>            
                        </div>
                    </div>
                    ) || null
                }
            </div>
        </div>
    );
}

export default FormBuscaPaciente;