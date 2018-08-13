import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: `http://localhost:8081/` //create axios object that points to backend (8081)
  });
}