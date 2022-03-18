export class StorageService {
    
    add = (key, value) => { 
        localStorage.setItem(key, value);
    }

    remove = (key) => { 
        localStorage.removeItem(key);
    }

    static get = (key) => {
        localStorage.getItem(key);
    }

    clear = () => {
        localStorage.clear();
    }
}