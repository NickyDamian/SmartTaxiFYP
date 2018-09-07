import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveDriverFeedback (rating) {
        return Api().post('saveDriverFeedback', rating);
    },
    getDriverFeedbacks (id) {
        return Api().post('getDriverFeedbacks', id);
    },
    savePassengerFeedback (rating) {
        return Api().post('savePassengerFeedback', rating);
    },
    saveBadRequest (rating) {
        return Api().post('savePassengerCancelFeedback', rating);
    },
    getBadRequest (id) {
        return Api().post('getPassengerCancelFeedbacks', id);
    }
}