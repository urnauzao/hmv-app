import React from "react";
import { RadioButton } from 'primereact/radiobutton';

const PerguntaInput = ({ pergunta, pergunta_id, resposta, obrigatoria, fnDefineResposta }) => {
    console.log(resposta)
    return (
        <div className="col-12 md:col-6 lg:col-6">
            <h5>{pergunta}</h5>
            <div className="grid">
                <div className="col-auto px-2">
                    <div className="field-radiobutton">
                        <RadioButton inputId={pergunta_id+":sim"} name={pergunta_id} value="Sim" checked={resposta === 'Sim'} onChange={(e) => fnDefineResposta(pergunta_id, e.target.value)}/>
                        <label htmlFor={pergunta_id+":sim"}>Sim</label>
                    </div>
                </div>
                <div className="col-auto px-2">
                    <div className="field-radiobutton">
                        <RadioButton inputId={pergunta_id+":nao"} name={pergunta_id} value="Não" checked={resposta === 'Não'} onChange={(e) => fnDefineResposta(pergunta_id, e.target.value)}/>
                        <label htmlFor={pergunta_id+":nao"}>Não</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     // return prevProps.location.pathname === nextProps.location.pathname;
//     console.log({prevProps}, {nextProps});
//     return false;
// };
// export default memo(PerguntaInput, comparisonFn)
export default PerguntaInput;