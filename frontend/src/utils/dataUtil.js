/* eslint-disable */
import axios from "axios";

export const getData = () => {
    const url = "http://localhost:3000/singlepiedata";
    console.log("here in getData")

    return axios.get(url, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }    
    }).then(res => {
        return res.data;
    })
};

export const getAccountNames = () => {
    const url = "http://localhost:3000/account-names";

    return axios.get(url, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }    
    }).then(res => {
        return res.data;
    })
}