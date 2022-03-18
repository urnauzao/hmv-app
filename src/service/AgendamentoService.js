import axios from 'axios'

export class AgendamentoService {
    
    getAgendamentos() {
        return axios.get('assets/demo/data/api/agendamentos.json')
            .then(res => res.data.data);
    }
}