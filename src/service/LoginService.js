import { RequestService } from './RequestService';
import ApiRoutes from './../ApiRoutes';
import {StorageService} from './StorageService';
    
class LoginService {
    reqService = new RequestService();

    async postLogin(email, password, device_name = "unknown")  { 
        console.log(ApiRoutes)
        const url = ApiRoutes['API_URL'] + ApiRoutes['LOGIN']['POST_LOGIN'];
        return this.reqService.post(url, {
            ...{ email },
            ...{ password },
            ...{ device_name }
        })
            .then(res => res.data)
            .then(result => { 
                this.setLogin(result);
            })
            .catch(
                (err) => {
                    console.log({ success: false, ...err.response.data});
                }
        );
    }

    setUser = ({ datas }) => {
        for (const key in datas) {
            if (Object.hasOwnProperty.call(datas, key)) {
                StorageService.add(key, datas[key]);
            }
        }
    }

    setLogin(token) { 
        StorageService.add('api_token', token);
    }

    logout() {
        StorageService.remove('api_token');
    }

}

const isLoged = () => {
    return StorageService.get('api_token') ? true : false;
}

const getToken = () => {
    return StorageService.get('api_token');
}

export { isLoged, getToken, LoginService };