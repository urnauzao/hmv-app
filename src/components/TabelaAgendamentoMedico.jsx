import React from "react";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const formatDate = (value) => { 
    try {
        return value.split('T',1).join().split('-',3).reverse().join('/')
    } catch (error) {
        return "Data desconhecida.";
    }
}
const TabelaAgendamentoMedico = ({agendamentos}) => {
    return (

        <div className="col-12">
            <div className="card">
                <h5>Últimas Consultas: </h5>
                <DataTable value={agendamentos } rows={25} paginator responsiveLayout="scroll" sortField='data' sortOrder='-1'>
                    <Column field="estabelecimento.nome" header="Local" sortable style={{ width: "15%" }} />
                    <Column header="Paciente" body={(data) => <img className="shadow-2 w-3rem" src={data?.perfil?.usuario?.foto} alt={data?.perfil?.usuario?.nome} />} />
                    <Column field="perfil.usuario.nome" header="Nome" sortable style={{ width: "15%" }} />
                    <Column field="exame" header="Exame" sortable style={{ width: "15%" }} />
                    <Column field="observacoes" header="Obs:" sortable style={{ width: "15%" }} />
                    <Column field="data" header="Data Consulta" sortable style={{ width: "20%" }} body={(data) => formatDate(data.data)} />
                    <Column
                        header="Situação"
                        style={{ width: "10%" }}
                        body={(data) => {
                            switch(data.situacao){ 
                                case '0':
                                case 'agendado':
                                    /** Agendado */
                                    return <Button label="Agendado" icon="pi pi-search" type="button" className="p-button-text" />
                                case '1':
                                case 'na_espera':
                                    /** Na espera */
                                    return <Button label="Na espera" icon="pi pi-search" type="button" className="p-button-text" />
                                case '2':
                                case 'em_realizacao':
                                    /** Em realização */
                                    return <Button label="Em realização" icon="pi pi-search" type="button" className="p-button-text" />
                                case '3':
                                case 'realizado':
                                    /** Realizado */
                                    return <Button label="Realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                case '4':
                                case 'nao_realizado':
                                    /** Não realizado */
                                    return <Button label="Não realizado" icon="pi pi-search" type="button" className="p-button-text" />
                                case 'emergencia':
                                    return <Button label="Chamado de Emergência" icon="" type="button" className="p-button-danger" />
                                default:
                                    /** Desconhecido */
                                    return <Button label="Desconhecido" icon="pi pi-search" type="button" className="p-button-text" />
                            }
                        }}
                    />
                </DataTable>
            </div>
        </div>
    );
}

export default TabelaAgendamentoMedico;