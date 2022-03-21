import ApiRoutes from '../ApiRoutes';
import { RequestService } from './RequestService';

export default class QuestionarioEmergenciaService {
    reqService = new RequestService();

    async getNewQuestionario(token, paciente_id) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['QUESTIONARIO_EMERGENCIA']['GET_NEW_QUESTIONARIO'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => {
                console.log("getNewQuestionario", result)
                return result;
            })
            .catch(
                (err, x) => {
                    console.log("QuestionarioEmergenciaService::getNewQuestionario", err, x);
                    return err;
                }
            );
    }

    async postNewQuestionario(token, paciente_id, data) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['QUESTIONARIO_EMERGENCIA']['POST_NEW_QUESTIONARIO'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.post(url, data)
            .then(res => res.data)
            .then(result => {
                console.log("postNewQuestionario", result)
                return result;
            })
            .catch(
                (err) => {
                    console.log("QuestionarioEmergenciaService::postNewQuestionario", err);
                    return null;
                }
            );
    }
}
