import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    register (details) {
        return Api().post('register', details);
    },
    login (credentials) {
        return Api().post('login', credentials);
    },
    findDetails (email) {
        return Api().post('findDetails', email);
    },
    updateDetails (email) {
        return Api().post('updateDetails', email);
    },
    deleteDetails (email) {
        return Api().post('deleteDetails', email);
    }
}