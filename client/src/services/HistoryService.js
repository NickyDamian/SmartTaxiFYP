import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveHistory (histories) {
        return Api().post('saveHistory', histories);
    },
    getHistory (id) {
        return Api().post('getHistory', id);
    }
}