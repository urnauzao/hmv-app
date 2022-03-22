import React, { useEffect, useContext, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { authContext } from '../../App';
import PerguntaInput from '../../components/PerguntaInput';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import HabitoSaudeService from './../../service/HabitoSaudeService';

const service = new HabitoSaudeService();

const HabitoSaudePage = () => {
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
        if(isLoading){
            service.getNewHabito(context.token, context.perfilSelected.id)
            .then((result) => { 
                if (result.status === 401) { 
                    context.signout();
                    return;
                }

                let __respostas = {};
                if (Array.isArray(result?.respostas_ultimo_habito_saude_em_aberto) &&
                    result.respostas_ultimo_habito_saude_em_aberto.length > 0) { 
                    console.log("result.respostas_ultimo_habito_saude_em_aberto", result.respostas_ultimo_habito_saude_em_aberto)
                    for (const resp of result.respostas_ultimo_habito_saude_em_aberto) { 
                        __respostas[resp.pergunta_habito_saude_id] = resp.resposta_texto;
                    }
                    setRespostas(__respostas);
                }

                if (Array.isArray(result?.perguntas_habito_saude) &&
                    result.perguntas_habito_saude.length > 0
                ) { 
                    setQuestoes(result.perguntas_habito_saude)
                }
                console.log(respostas);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err)
                setMsgRetornoAcao("Não foi possível salvar o questionário de emergência. Atualize a página e tente novamente");
                setShowDialog(true);
            })
        }
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
        service.postNewHabito(context.token, context.perfilSelected.id, { ...respostas })
            .then((result) => {
                                
                if (result.status === 401) { 
                    context.signout();
                    return;
                }

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
                    <h2 className='mb-3'>Hábitos de Saúde</h2>
                    {isLoading ? 
                        <h5>Carregando...</h5>
                        :
                        <div className='grid'>
                            {   
                                questoes.map((quest) =>
                                    <PerguntaInput
                                        key={"habito_saude"+quest.id}
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

export default HabitoSaudePage;
