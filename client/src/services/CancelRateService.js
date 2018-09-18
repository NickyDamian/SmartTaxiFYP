import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveRate (rate) {
        return Api().post('postCancelRate', rate);
    },
    getRate (email) {
        return Api().post('getCancelRate', email);
    }
}