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
                (err) => {
                    console.log(err);
                    // console.log({ success: false, ...err.response?.data || err.response });
                    return null;
                }
            );
    }
}