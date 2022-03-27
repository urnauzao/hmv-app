import React, { useState }  from "react";
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import DialogQuestionariosPaciente from './DialogQuestionariosPaciente';
import DialogVerHistorico from './DialogVerHistorico';
import DialogConcluirAtendimento from './DialogConcluirAtendimento';

const EmergenciaCard = ({ emergencia, token }) => {
    
    const [showQuestionarioEmergencia, setShowQuestionaEmergencia] = useState(false);
    const [showHabitoSaude, setShowHabitoSaude] = useState(false);
    const [showHistorico, setShowHistorico] = useState(false);
    const [showConcluirAtendimento, setShowConcluirAtendimento] = useState(false);

    const hideDialogs = () => { 
        setShowQuestionaEmergencia(false);
        setShowHabitoSaude(false);
        setShowHistorico(false);
        setShowConcluirAtendimento(false);
    }

    return (
        <div className="col-12 md:col-6 lg:col-4 xl:col-3">
            <div className="card mb-0 border-pink-700 hover:border-pink-900 border-3 border-round font-bold flex align-items-center bg-pink-100">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <p className="mb-1">
                            <span className="block text-500 text-4xl font-medium mb-3 text-lg text-pink-600">Emergência!</span>
                        </p>
                        <h4 className="align-items-center flex">
                            <Avatar size="xlarge" className="mx-2" image={emergencia?.perfil?.usuario?.foto} />{emergencia?.perfil?.usuario?.nome || '(Sem nome)'}
                        </h4>
                        <Button type="button" onClick={()=> setShowQuestionaEmergencia(true)} label="Quest. Emergência" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                        <Button type="button" onClick={()=> setShowHabitoSaude(true)} label="Habitos de Saúde" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                        <Button type="button" onClick={()=> setShowHistorico(true)} label="Histórico" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />
                        <Button type="button"  onClick={()=> setShowConcluirAtendimento(true)} label="Concluir Atendimento" className="p-button-raised p-button-text bg-white m-1 hover:bg-white-alpha-50" icon="pi pi-star-fill" />    
                    </div>
                    <div className="flex align-items-center justify-content-center bg-pink-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                        <i className="pi pi-question-circle text-pink-600 text-xl" />
                    </div>
                </div>
            </div>
            {
                showQuestionarioEmergencia ? 
                    <DialogQuestionariosPaciente token={token} paciente_id={emergencia?.perfil?.id} tipo="questionario_emergencia" hideDialogs={hideDialogs} />
                : null
            }
            {
                showHabitoSaude ? 
                    <DialogQuestionariosPaciente token={token} paciente_id={emergencia?.perfil?.id} tipo="habito_saude" hideDialogs={hideDialogs} />
                : null
            }
            {
                showHistorico ? 
                    <DialogVerHistorico token={token} paciente_id={emergencia?.perfil?.id} tipo="medico" hideDialogs={hideDialogs} />
                : null
            }
            {
                showConcluirAtendimento ? 
                    <DialogConcluirAtendimento token={token} paciente_id={emergencia?.perfil?.id} tipo="medico" hideDialogs={hideDialogs} agendamento_id={emergencia.id} />
                : null
            }
        </div>
    );
}

export default EmergenciaCard;