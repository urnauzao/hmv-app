import { Button } from 'primereact/button';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { authContext } from '../../App';
import PerguntaInput from '../../components/PerguntaInput';
import QuestionarioEmergenciaService from './../../service/QuestionarioEmergenciaService';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

const service = new QuestionarioEmergenciaService();

const QuestionarioEmergenciaPage = () => {
    const context = useContext(authContext);
    const history = useNavigate();
    const toast = useRef();
    const [questoes, setQuestoes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [respostas, setRespostas] = useState({});
    const [sendingLoading, setSendingLoading] = useState(false);
    const [msgRetornoAcao, setMsgRetornoAcao] = useState("-");
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        // console.log(context.perfilSelected)
        service.getNewQuestionario(context.token, context.perfilSelected.id)
        .then((result) => { 
            console.log({ result })
            let __respostas = {};
            if (Array.isArray(result?.respostas_ultimo_questionario_em_aberto) &&
                result.respostas_ultimo_questionario_em_aberto.length > 0) { 
                console.log("result.respostas_ultimo_questionario_em_aberto", result.respostas_ultimo_questionario_em_aberto)
                for (const resp of result.respostas_ultimo_questionario_em_aberto) { 
                    __respostas[resp.pergunta_emergencia_id] = resp.resposta_texto;
                }
                setRespostas(__respostas);
            }

            if (Array.isArray(result?.perguntas_questionario) &&
                result.perguntas_questionario.length > 0
            ) { 
                setQuestoes(result.perguntas_questionario)
            }
            console.log(respostas);
            setIsLoading(false);
        }).catch((err) => {
                console.log(err)
                setMsgRetornoAcao("Não foi possível salvar o questionário de emergência. Atualize a página e tente novamente");
                setShowDialog(true);
            })
    }, []);

    const defineResposta = (perg_id, resposta) => { 
        const __respostas = { ...respostas }
        __respostas[perg_id] = resposta;
        setRespostas({ ...__respostas });
    }

    const sendResposta = () => { 
        if (!sendingLoading) { 
            setSendingLoading(true)
        }
        service.postNewQuestionario(context.token, context.perfilSelected.id, { ...respostas })
            .then((result) => {
                if (result?.success) {
                    setMsgRetornoAcao(result?.msg);
                    setShowDialog(true);
                    setSendingLoading(false)
                } else {
                    console.log(result);
                    toast.current.show(
                        {
                            severity: 'error',
                            summary: 'Ocorreu um erro ao realizar a ação!',
                            detail: result?.msg || "Erro desconhecido!",
                            life: 5000
                        }
                    );
                    setMsgRetornoAcao(result?.msg);
                    setSendingLoading(false)
                }
                
            });
    }

    const sair = () => { 
        history('/', true);
    }

    const dialogButton = <Button type="button" label="Fechar" onClick={sair} icon="pi pi-check" className="p-button-secondary" />;

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h2 className='mb-3'>Questionário Emergência</h2>
                    {isLoading ? 
                        <h5>Carregando...</h5>
                        :
                        <div className='grid'>
                            {   
                                questoes.map((quest) =>
                                    <PerguntaInput
                                        key={"questionario_emergencia"+quest.id}
                                        pergunta={quest.pergunta}
                                        pergunta_id={quest.id}
                                        resposta={respostas[quest.id]}
                                        obrigatoria={quest.obrigatoria}
                                        fnDefineResposta={defineResposta}
                                    />
                                )
                            }
                            <div className="col-12 text-right">
                                <Button label="Salvar" className='px-8' onClick={sendResposta} loading={sendingLoading}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Toast ref={toast} />
            <Dialog
                header="Resultado da Ação"
                visible={showDialog}
                style={{ width: '30vw' }}
                modal footer={dialogButton}
                onHide={sair}
            >
                {msgRetornoAcao}
            </Dialog>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

// export default React.memo(QuestionarioEmergenciaPage, comparisonFn);
export default QuestionarioEmergenciaPage;
