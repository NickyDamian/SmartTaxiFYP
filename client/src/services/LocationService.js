import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveLocation (position) {
        return Api().post('location', position);
    },
    getLocation () {
        return Api().get('location');
    }
}