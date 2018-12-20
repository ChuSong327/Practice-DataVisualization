/* eslint-disable */
import axios from "axios";

export const getData = () => {
    const url = "http://localhost:3000";

    return axios.get(url, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }    
    }).then(res => {
        return res.data;
    })
};