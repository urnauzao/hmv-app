import axios from "axios";

export class RequestService { 
    
    constructor(config = {}) {
        this.config = config;
    }

    setAuth = (bearer) => { 
        this.config.headers = { Authorization: bearer }
        return this;
    }

    get = (url) => { 
        return axios.get(url, this.config)
    }

    post = (url, data) => { 
        return axios.post(url, data, this.config)
    }

    put = (url, data) => {
        return axios.put(url, data, this.config)
    }

    delete = (url) => { 
        return axios.post(url, this.config)
    }

}