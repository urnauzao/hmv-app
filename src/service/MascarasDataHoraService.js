const mascaraData = (value) => { 
    try {
        return value.slice(0, 10)
            // .replace(/\D/g, '')
            // .replace(/(\d{2})(\d)/, '$1-$2')
            // .replace(/(\d{4})(\d)/, '$1-$2') 
            // .replace(/(\d{4})(\d)/, '$1-$2') 
            // .slice(0,10)
    } catch (error) {
        return "";   
    }
}

const mascaraHora = (value) => { 
    try {
        return value
            .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
            .replace(/(\d{2})(\d)/, '$1:$2') 
            .replace(/(\d{2})(\d)/, '$1:$2')
            .replace(/(\d{2})(\d)/, '$1:$2')
            .slice(0, 8)
    } catch (error) {
        return "";
    }
}

export { mascaraData, mascaraHora }