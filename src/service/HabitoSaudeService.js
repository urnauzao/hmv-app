import ApiRoutes from '../ApiRoutes';
import { RequestService } from './RequestService';
import { useContext } from 'react';
import { authContext } from '../App';

export default class HabitoSaudeService {
    reqService = new RequestService();

    async getNewHabito(token, paciente_id) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['HABITO_SAUDE']['GET_NEW_HABITO'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => {
                console.log("getNewHabito", result)
                return result;
            })
            .catch(({ response }) => {
                return response;
            });
    }

    async postNewHabito(token, paciente_id, data) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['HABITO_SAUDE']['POST_NEW_HABITO'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.post(url, data)
            .then(res => res.data)
            .then(result => {
                console.log("postNewHabito", result)
                return result;
            })
            .catch(
                ({ response }) => {
                    console.log("HabitoSaudeService::postNewHabito", response);
                    return response;
                }
            );
    }
}
