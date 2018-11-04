import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveOnlinePassenger (id) {
        return Api().post('saveOnlinePassenger', id);
    },
    deleteOnlinePassenger (id) {
        return Api().post('deleteOnlinePassenger', id);
    },
    getOnlinePassenger () {
        return Api().get('getOnlinePassenger');
    }
}