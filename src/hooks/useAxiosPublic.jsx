import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://task-management-system-server-1.onrender.com",
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
