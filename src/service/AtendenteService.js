import ApiRoutes from "../ApiRoutes";
import { RequestService } from "./RequestService";

export default class AtendenteService {

    reqService = new RequestService();

    async getMetrics(token) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ATENDENTE']['GET_METRICS'];
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => {
                console.log("getMetrics", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log(response);
                    return null;
                }
            );
    }

    async postPacienteByDoc(token, data = {}) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ATENDENTE']['POST_PACIENTE_BUSCAR'];
        this.reqService.setAuth(token);
        return this.reqService.post(url, data)
            .then(res => res.data)
            .then(result => {
                console.log("postPacienteByDoc", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log(response);
                    return null;
                }
            );
    }

    async postAgendamentoNovo(token, paciente_id, data = {} ) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ATENDENTE']['POST_AGENDAMENTO_NEW'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.post(url, data)
            .then(res => res.data)
            .then(result => {
                console.log("postAgendamentoNovo", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log(response);
                    return null;
                }
            );
    }

    async putAgendamentoSituacao(token, agendamento_id, situacao_id) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ATENDENTE']['PUT_AGENDAMENTO_SIT'] + '/' + agendamento_id + '/' + situacao_id;
        this.reqService.setAuth(token);
        return this.reqService.put(url)
            .then(res => res.data)
            .then(result => {
                console.log("putAgendamentoSituacao", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log(response);
                    return null;
                }
            );
    }
    
    async getAgendamentoDifinirMedico(token, agendamento_id, medico_id) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ATENDENTE']['GET_AGENDAMENTO_DEFINIR_MEDICO'] + '/' + agendamento_id + '/' + medico_id;
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => {
                console.log("getAgendamentoDifinirMedico", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log(response);
                    return null;
                }
            );
    }

    async getEstabelecimentosParaAgendamento(token, paciente_id) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ATENDENTE']['GET_AGENDAMENTO_ESTABELECIMENTOS'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => {
                console.log("getEstabelecimentosParaAgendamento", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log(response);
                    return null;
                }
            );
    }
    
}