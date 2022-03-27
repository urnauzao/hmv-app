import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import MedicoService from '../service/MedicoService';
import { Dialog } from 'primereact/dialog';

const service = new MedicoService();

const DialogQuestionariosPaciente = ({ token, paciente_id, tipo, hideDialogs }) => {

    const [questionario, setQuestionario] = useState(null);
    const [displayShow, setDisplayShow] = useState(true);

    useEffect(() => { 
        if (tipo === 'questionario_emergencia') {
            if (questionario === null)
                service.getQuestionariosEmergenciaPaciente(token, paciente_id).then((result) => {
                    setQuestionario(result);
                    setDisplayShow(true);
                });
        } else if (tipo === 'habito_saude') { 
            if (questionario === null)
                service.getHabitoSaudePaciente(token, paciente_id).then((result) => {
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
            // return value.split('T',1).join().split('-',3).reverse().join('/')
            let date = value.split(" ");
            return date[0].split('-', 3).reverse().join('/') + " " + date[1];
        } catch (error) {
            return "Data desconhecida.";
        }
    }

    const dialogFooter = <Button type="button" label="Fechar" onClick={hide} icon="pi pi-check" className="p-button-secondary" />;

    return (
        
        <Dialog header={
            tipo === 'questionario_emergencia' ?
            "Histórico de Questionário de Emergência" :
            "Histórico de Hábitos de Saúde"
            } 
            visible={displayShow} style={{ width: '30vw' }} modal footer={dialogFooter} onHide={hide}>
            <div className="grid py-2">
            {(questionario && 
                questionario.map((quest) => 
                    <div className="col-12" key={tipo+quest[0]?.[tipo + "_id"]}>
                        <div className="card mb-0 border-indigo-700 hover:border-indigo-900 border-3 border-round font-bold flex align-items-center bg-indigo-50">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <h4 className="text-indigo-900">#{quest[0]?.[tipo + "_id"]} | {formatDate(quest[0] ? quest[0]?.data_criacao : null)}</h4>
                                    {
                                        quest?.map((item_quest) => 
                                            <p className="mb-2" key={item_quest?.resposta_id}>
                                                <strong className="text-600">{item_quest.pergunta}</strong><br />
                                                <span>R: {item_quest.resposta_texto}</span>
                                            </p>
                                        )
                                    }
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

export default DialogQuestionariosPaciente;