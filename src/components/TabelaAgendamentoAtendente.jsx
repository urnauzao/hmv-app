import React, {useState} from "react";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

const formatDate = (value) => { 
    try {
        let date = value.split(" ");
        return date[0].split('-', 3).reverse().join('/') + " " + date[1];
    } catch (error) {
        return "Data desconhecida.";
    }
}

const situacoes = [
    {name:"Agendado", code:"agendado", int:'0'},
    {name:"Na Espera", code:"na_espera", int:'1'},
    {name:"Em Realização", code:"em_realizacao", int:'2'},
    {name:"Realizado", code:"realizado", int:'3'},
    {name:"Não Realizado", code:"nao_realizado", int:'4'},
    {name:"Emergência", code:"emergencia", int:'5'}
];
const TabelaAgendamentoAtendente = ({ agendamentos, token, service }) => {
    const [agends, setAgends] = useState(agendamentos);
    const [disableDropdowns, setDisableDropdowns] = useState(false);

    const saveChange = (agendamento_id, valor) => { 
        console.log(agendamento_id, valor);
        setDisableDropdowns(true);
        const sit = situacoes.filter(x => x.code === valor)
        service.putAgendamentoSituacao(token, agendamento_id, sit[0].int).then((result) => {

            let __agendamentos = [...agends];
            let updated = __agendamentos.map((ag) => { 
                if (ag.agendamento_id === agendamento_id) {
                    ag.situacao = valor;
                }
                return ag;
            })
            setAgends(updated);
            setDisableDropdowns(false);
        });
    }




    return (
        <DataTable value={agends } rows={5} paginator responsiveLayout="scroll" sortField='data' sortOrder='-1'>
            <Column field="estabelecimento_nome" header="Local" sortable style={{ width: "15%" }} />
            <Column header="Foto" body={(data) => <img className="shadow-2 w-3rem" src={data?.paciente_foto} alt={data?.paciente_nome} />} />
            <Column field="paciente_nome" header="Nome" sortable style={{ width: "15%" }} />
            <Column field="exame" header="Exame" sortable style={{ width: "15%" }} />
            <Column field="observacoes" header="Obs:" sortable style={{ width: "15%" }} />
            <Column field="agendamento_data" header="Data Consulta" sortable style={{ width: "20%" }} body={(data) => formatDate(data.agendamento_data)} />
            <Column
                header="Situação"
                style={{ width: "10%" }}
                body={(data) => {
                    switch(data.situacao){ 
                        case '0':
                        case 'agendado':
                            /** Agendado */
                            return <Dropdown disabled={disableDropdowns} optionValue="code" value={data.situacao} options={situacoes} onChange={(e) => saveChange(data.agendamento_id, e.target.value)} optionLabel="name" />
                        case '1':
                        case 'na_espera':
                            /** Na espera */
                            return <Dropdown className="bg-orange-300 text-orange-700 font-bold" disabled={disableDropdowns} optionValue="code" value={data.situacao} options={situacoes} onChange={(e) => saveChange(data.agendamento_id, e.target.value)} optionLabel="name" />
                        case '2':
                        case 'em_realizacao':
                            /** Em realização */
                            return <Dropdown className="bg-indigo-300 text-indigo-700 font-bold" disabled={disableDropdowns} optionValue="code" value={data.situacao} options={situacoes} onChange={(e) => saveChange(data.agendamento_id, e.target.value)} optionLabel="name" />
                        case '3':
                        case 'realizado':
                            /** Realizado */
                            return <Button label="Realizado" icon="" type="button" className="p-button-success" />
                        case '4':
                        case 'nao_realizado':
                            /** Não realizado */
                            return <Button label="Não realizado" icon="" type="button" className="p-button-warning" />
                        case 'emergencia':
                            return <Dropdown className="bg-pink-300 text-pink-700 font-bold" disabled={disableDropdowns} optionValue="code" value={data.situacao} options={situacoes} onChange={(e) => saveChange(data.agendamento_id, e.target.value)} optionLabel="name" />
                        default:
                            /** Desconhecido */
                            return <Button label="Desconhecido" icon="" type="button" className="p-button-text" />
                    }
                }}
            />
        </DataTable>
    );
}

export default TabelaAgendamentoAtendente;