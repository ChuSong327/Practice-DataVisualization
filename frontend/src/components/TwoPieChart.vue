<template>
    <div>
        <p>Select an account</p>
        <select name="account" id="account-names">
            <option v-for="(account, index) in accountNames" :key="index" :index="index">{{ account.acctName }}</option>
        </select>
    </div>
</template>

<script>
/* eslint-disable */
import * as DataUtil from "../utils/dataUtil"
export default {
    name: "TwoPieChart",
    data() {
        return {
            accountNames: []
        }
    },
    created(){
        DataUtil.getAccountNames().then(res => {
            res.map(el => {
                this.accountNames.push({acctName: el.ACCOUNT_NAME})
                return this.accountNames;
            })
        }).then(() => {
            console.log("this is the accountNames:", this.accountNames);
        })
    }
}
</script>