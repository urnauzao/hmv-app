import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import MedicoService from '../service/MedicoService';
import { Dialog } from 'primereact/dialog';

const service = new MedicoService();

const DialogVerHistorico = ({ token, paciente_id, tipo, hideDialogs }) => {

    const [questionario, setQuestionario] = useState(null);
    const [displayShow, setDisplayShow] = useState(true);

    useEffect(() => { 
        if (tipo === 'medico') {
            if (questionario === null)
                service.getHistoricoPaciente(token, paciente_id).then((result) => {
                    setQuestionario(result);
                    setDisplayShow(true);
                });
        }
    }, [])

    const hide = () => { 
        if (displayShow === true) {
            setDisplayShow(false);
            hideDialogs();
        }
    }

    const formatDate = (value) => { 
        try {
            let date = value.split(" ");
            return date[0].split('-', 3).reverse().join('/') + " " + date[1];
        } catch (error) {
            return "Data desconhecida.";
        }
    }

    const dialogFooter = <Button type="button" label="Fechar" onClick={hide} icon="pi pi-check" className="p-button-secondary" />;

    return (
        
        <Dialog header={"Histórico de Atendimentos"} 
            visible={displayShow} style={{ width: '30vw' }} modal footer={dialogFooter} onHide={hide}>
            <div className="grid py-2">
            {(questionario && 
                questionario.map((hist) => 
                    <div className="col-12" key={hist.historicos_atendimento_id}>
                        <div className="card mb-0 border-indigo-700 hover:border-indigo-900 border-3 border-round font-bold flex align-items-center bg-indigo-50">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <h4 className="text-indigo-900">Consulta: #{hist.agendamento_id} | {formatDate(hist.agendamento_data)}</h4>
                                    <h5 className="text-blue-700">Exame: {hist?.exame || "desconhecido"}</h5>
                                    <p className="mb-2">
                                        <strong className="text-600">{hist.relatorio}</strong><br />
                                        <span className="text-900">Observações:</span> {hist.agendamento_observacoes}<br />
                                        <span className="text-900">Código Médico:</span> {hist?.medico_perfil_id || "desconhecido"}<br />
                                        <span className="text-900">Código Socorrista:</span> {hist?.socorrista_perfil_id || "desconhecido"}<br />
                                        <span className="text-900">Código Atendente:</span> {hist?.atendente_perfil_id || "desconhecido"}<br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div >
                )
            ) || "Carregando..."
            }
            </div>
        </Dialog>
    );
}

export default DialogVerHistorico;