import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveLocation (position) {
        return Api().post('location', position);
    },
    deleteLocation (id) {
        return Api().post('deletelocation', id);
    },
    getLocation () {
        return Api().get('location');
    }
}