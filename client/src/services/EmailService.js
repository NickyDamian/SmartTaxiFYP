import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    sendEmail (receipt) {
        return Api().post('sendEmail', receipt);
    }
}