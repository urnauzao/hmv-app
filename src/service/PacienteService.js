import ApiRoutes from "../ApiRoutes";
import { RequestService } from "./RequestService";

export default class PacienteService {

    reqService = new RequestService();

    async getMetrics(token, paciente_id) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['PACIENTE']['GET_METRICS'] + '/' + paciente_id;
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
    async postChamadoEmergencia(token, paciente_id, data = {}) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['PACIENTE']['POST_CHAMADO_EMERGENCIA'] + '/' + paciente_id;
        this.reqService.setAuth(token);
        return this.reqService.post(url, data)
            .then(res => res.data)
            .then(result => {
                console.log("postChamadoEmergencia", result)
                return result;
            })
            .catch(
                ({response}) => {
                    console.log(response);
                    return null;
                }
            );
    }
}