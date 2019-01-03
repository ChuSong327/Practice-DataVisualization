/* eslint-disable */
import axios from "axios";

export const getData = () => {
    const url = "http://localhost:3000/singlepiedata";

    return axios.get(url).then(res => {
        return res.data;
    })
};

export const getAccountNames = () => {
    const url = "http://localhost:3000/account-names";

    return axios.get(url, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "withCredentials": "false"
        },  
    }).then(res => {
        return res.data;
    })
};

export const getCaseByAccountName = (acctName) => {
    const url = `http://localhost:3000/case/${acctName}`;

    return axios.get(url, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }).then(res => {
        return res.data;
    })
};

export const getContactByAccountName = (acctName) => {
    const url = `http://localhost:3000/contact/${acctName}`;

    return axios.get(url, {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }).then(res => {
        return res.data;
    })
};