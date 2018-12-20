<template>
    <div id="pie-chart" style="width: 700px; height:600px"></div>
</template>

<script>
/* eslint-disable */
import * as DataUtil from "../utils/dataUtil"
const echarts = require('echarts');

export default {
    name: "PieChart",
    data(){
        return {
            pieData: []
        }
    },
    created() {
        DataUtil.getData().then(res => {
            res.map(el => {
                this.pieData.push({name: el.BILLINGCOUNTRY, value: el.COUNT});
                return this.pieData;
            });
        }).then(() =>{
             const firstPieChart = echarts.init(document.getElementById('pie-chart'));
             const option = {
                series: {
                    name: "billing",
                    type: "pie",
                    data: this.pieData
                }
            };
            firstPieChart.setOption(option);
        })
    },
  }
</script>