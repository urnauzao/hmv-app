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
                return result;
            })
            .catch((err) => {
                    console.log({ success: false, ...err.response.data });
                    return null;
            });
    }
    async getMe(token)  { 
        const url = ApiRoutes['API_URL'] + ApiRoutes['LOGIN']['GET_ME'];
        this.reqService.setAuth(token);
        return this.reqService.get(url)
            .then(res => res.data)
            .then(result => { 
                console.log("result", result)
                setUsersMe(result);
                setUserPerfilSelected(result.perfis[0])
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
        // StorageService.remove('api_token');
        StorageService.clear();
    }

    async register (data = {}) {
        const url = ApiRoutes['API_URL'] + ApiRoutes['LOGIN']['POST_REGISTER'];
        return this.reqService.post(url, data)
            .then(res => res.data)
            .then(result => {
                console.log("register", result)
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

const isLoged = () => {
    return StorageService.get('api_token') ? true : false;
}

const getToken = () => {
    return StorageService.get('api_token');
}

const getUsersMe = () => {
    let usersMe = StorageService.get('users_me');
    if (usersMe) { 
        return JSON.parse(usersMe);
    }
    return null;
}
const setUsersMe = (user) => {
    StorageService.add('users_me', JSON.stringify(user));
}

const getUserPerfilSelected = () => {
    let perfil = StorageService.get('perfil_selected');
    if (perfil) {
        return JSON.parse(perfil);
    }
    return null;
}
const setUserPerfilSelected = (perfil) => {
    StorageService.add('perfil_selected', JSON.stringify(perfil));
}

const newUserModel = { 
    "email": "",
    "password": "",
    "doc_tipo": "",
    "doc_numero": "",
    "foto": "",
    "nome": "",
    "endereco":{
        "nome": "",
        "tipo": "",
        "logradouro": "",
        "cep": "",
        "numero": "",
        "cidade": "",
        "estado": "",
        "complemento": "",
    }
}





export { isLoged, getToken, getUsersMe, setUsersMe, getUserPerfilSelected, setUserPerfilSelected, newUserModel, LoginService };