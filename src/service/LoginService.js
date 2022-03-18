import { RequestService } from './RequestService';
import ApiRoutes from './../ApiRoutes';
import { StorageService } from './StorageService';
    
export class LoginService {
    reqService = new RequestService();

    async postLogin(email, password, device_name = "unknown") { 
        console.log(ApiRoutes)
        const url = ApiRoutes['API_URL'] + ApiRoutes['LOGIN']['POST_LOGIN'];
        return this.reqService.post(url, {
            ...{ email },
            ...{ password },
            ...{ device_name }
        })
            .then(res => res.data)
            .then(result => { 
                console.log('resultado', result);
                this.setLogin(result);
                return { success: true };
            })
            .catch(
                (err) => {
                    return { success: false, ...err.response.data};
                }
        );
    }

    setLogin(token) { 
        (new StorageService()).add('api_token', token);
    }

    static isLoged() { 
        return StorageService.get('api_token') ? true : false;
    }

    logout() {
        (new StorageService()).remove('api_token');
    }

}