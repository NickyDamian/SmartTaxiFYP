import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    saveDriverFeedback (rating) {
        return Api().post('saveDriverFeedback', rating);
    },
    getDriverFeedback (passengerId) {
        return Api().post('getDriverFeedbacks', passengerId);
    },
    savePassengerFeedback (rating) {
        return Api().post('savePassengerFeedback', rating);
    },
    getPassengerFeedback (driverId) {
        return Api().post('getPassengerFeedbacks', driverId);
    },
    saveBadRequest (rating) {
        return Api().post('savePassengerCancelFeedback', rating);
    },
    getBadRequest (id) {
        return Api().post('getPassengerCancelFeedbacks', id);
    }
}