export const StorageService = {
    
    add : (key, value) => { 
        localStorage.setItem(key, value);
    },

    remove : (key) => { 
        localStorage.removeItem(key);
    },

    get : (key) => {
        return localStorage.getItem(key);
    },

    clear : () => {
        localStorage.clear();
    }
}