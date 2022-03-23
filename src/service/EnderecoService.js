import ApiRoutes from '../ApiRoutes';
import { RequestService } from './RequestService';

export default class EnderecoService {
    reqService = new RequestService();

    async getMyAll(token) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['ENDERECO']['GET_ALL_MY'];
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => {
                console.log("getMyAll", result)
                return result;
            })
            .catch(({ response }) => {
                return response;
            });
    }
}
