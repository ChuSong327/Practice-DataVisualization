<template>
    <div style="height: auto;">
        <div>
            <p>Select an account</p>
            <select name="account" id="account-names">
                <option v-for="(account, index) in accountNames" :key="index" :index="index">{{ account.acctName }}</option>
            </select>
            <button v-on:click="updateData">Update</button>
        </div>
        <div class="chart">
            <div id="acct-case"></div>
            <div id="acct-contact"></div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import * as DataUtil from "../utils/dataUtil"
const echarts = require("echarts")

export default {
    name: "TwoPieChart",
    data() {
        return {
            accountNames: [],
            casesByAcct:[],
            contactsByAcct:{
                type: [],
                count:[]
            },
            
        }
    },
    created() {
        DataUtil.getAccountNames().then(res => {
            res.map(el => {
                this.accountNames.push({acctName: el.ACCOUNT_NAME})
                return this.accountNames;
            })
        });
    },
    methods: {
        updateData() {
            const acctName = document.querySelector("#account-names").value;
            DataUtil.getCaseByAccountName(acctName).then(res => {
                this.casesByAcct.length = 0;
                res.map(el => {
                    if (!el.CASE_SEVERITY) {
                        this.casesByAcct.push({
                            name: "NULL", 
                            value: el.CASE_COUNT 
                        });
                    } else {
                        this.casesByAcct.push({
                            name: el.CASE_SEVERITY, 
                            value: el.CASE_COUNT 
                        });
                    }
                    return this.casesByAcct;
                })
            }).then(() => {
                const acctCaseChart = echarts.init(document.getElementById("acct-case"));
                const caseOption = {
                    color: ["#0CCCE8","#FFCED8","#59947C","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],
                    tooltip: {
                        trigger: "item",
                        formatter: "{a}<br/>{b} : {c} ({d}%)"
                    },
                    calculable: true,
                    series: {
                        name: "Account Cases",
                        type: "pie",
                        radius: [30, 110],
                        center: ["75%", "50%"],
                        roseType: "area",
                        data: this.casesByAcct  
                    }
                };
                acctCaseChart.setOption(caseOption);
            });
            DataUtil.getContactByAccountName(acctName).then(res => {
                this.contactsByAcct.length = 0;
                 res.map(el => {
                    this.contactsByAcct.type.push(el.CONTACT_TYPE);
                    this.contactsByAcct.count.push(el.CONTACT_COUNT);
                    return this.contactsByAcct;
                })
            }).then(() => {
                const acctContactChart = echarts.init(document.getElementById("acct-contact"));
                const contactOption = {
                    color: ["#E8BF92"],
                    tooltip: {
                        trigger: "axis", 
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        data: ["hello"]
                    },
                    xAxis: [
                        {
                            type: "category",
                            data: this.contactsByAcct.type,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value"
                        }
                    ],
                    series: [
                        {
                            name: "Account Contacts",
                            type: "bar",
                            barWidth: "60%",
                            data: this.contactsByAcct.count
                        }
                    ]
                };
                acctContactChart.setOption(contactOption);
            });
        }
    }

}
</script>

<style>
    .chart {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding: 0;
        margin-bottom: 100px;
    }
    #acct-case {
        height: 500px;
        width: 630px;
        margin: 0;
        padding: 0;
    }
     #acct-contact {
        height: 500px;
        width: 500px;
        margin: 0;
        padding: 0;
    }
</style>