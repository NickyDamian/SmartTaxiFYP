import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    getPickups (id) {
        return Api().post('getPickups', id);
    },
    savePickups (pickups) {
        return Api().post('savePickups', pickups);
    }
}