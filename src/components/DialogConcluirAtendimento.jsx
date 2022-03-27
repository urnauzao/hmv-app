import React, { useState } from "react";
import { Button } from 'primereact/button';
import MedicoService from '../service/MedicoService';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

const service = new MedicoService();

const DialogConcluirAtendimento = ({ token, paciente_id, tipo, hideDialogs, agendamento_id }) => {

    // const [questionario, setQuestionario] = useState(null);
    const [displayShow, setDisplayShow] = useState(true);
    const [showSucesso, setShowSucesso] = useState(false);
    const [relatorio, setRelatorio] = useState(null);
    const [sending, setSending] = useState(false);
    
    const sendRelatorio = () => { 
        setSending(true);
        service.postRelatorioAtendimento(token, paciente_id, {
            relatorio: relatorio,
            agendamento_id: agendamento_id
        }).then((result) => {
            setShowSucesso(true);
        });
    }

    const hide = () => { 
        if (displayShow === true) {
            setSending(false);
            setShowSucesso(false);
            setDisplayShow(false);
            hideDialogs();
        }
    }

    const dialogFooter = () => {
        return showSucesso ?
            null : <Button type="button" label="Enviar" loading={sending} onClick={sendRelatorio} icon="pi pi-check" className="p-button-secondary" />
    }

    return (
        
        <Dialog header={"Concluir Atendimento"} 
            visible={displayShow} style={{ width: '30vw' }} modal footer={dialogFooter} onHide={hide}>
            <div className="grid py-2">
                <div className="col-12" >
                    <h4 className="text-indigo-900"><i className="pi pi-align-left"></i> Consulta: #{agendamento_id}</h4>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12">
                            <InputTextarea rows={5} placeholder="Descreva os procedimentos realizados e os medicamentes ou exames indicados." onChange={(e) => setRelatorio(e.target.value)} />
                        </div>
                    </div>
                    {showSucesso ? <p className="bg-green-50 text-green-700 tex-center">Salva e finalizado com sucesso!</p> : null}
                </div>
            </div>
        </Dialog>
    );
}

export default DialogConcluirAtendimento;