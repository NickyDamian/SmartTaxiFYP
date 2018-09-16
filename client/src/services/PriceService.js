import Api from '@/services/Api' //Api object from the Api file that will have the axios object

export default {
    index () {
        return Api().get('index');
    },
    post (price) {
        return Api().post('post', price);
    }
}