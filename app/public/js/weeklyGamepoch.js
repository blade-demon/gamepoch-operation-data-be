$(function () {
    var pieData = window.pieData;
    
    // 问题1的答案
    var tempData1 = pieData[0];
    var data1 = [];
    for (var value of tempData1) {
        data1[0] = value.alone || 0;
        data1[1] = value.friend || 0;
        data1[2] = value.family || 0;
    }
    var container1Data = [
        {name: "自己", y: data1[0]},
        {name: '朋友', y: data1[1]},
        {name: "家人", y: data1[2]}
    ];
    
    // 问题2的答案
    var tempData2 = pieData[1];
    var data2 = [];
    for (var value of tempData2) {
        data2[0] = value.true || 0;
        data2[1] = value.false || 0;
    }
    var container2Data = [
        {name: '是', y: data2[0]},
        {name: "否", y: data2[1]},
    ];
    
    // 问题3的答案
    var tempData3 = pieData[2];
    var data3 = [];
    for (var value of tempData3) {
        data3[0] = value.oneWeek || 0;
        data3[1] = value.twoWeek || 0;
        data3[2] = value.oneMonth || 0;
    }
    var container3Data = [
        {name: '一周', y: data3[0]},
        {name: "两周", y: data3[1]},
        {name: "一个月", y: data3[2]}
    ];
    
    // 问题4的答案
    var tempData4 = pieData[3];
    var data4 = [];
    for (var value of tempData4) {
        data4[0] = value.under20 || 0;
        data4[1] = value.under30 || 0;
        data4[2] = value.up30 || 0;
    }
    var container4Data = [
        {name: '15-20', y: data4[0]},
        {name: '20-30', y: data4[1]},
        {name: '大于30', y: data4[2]}
    ];
    
    $('#container1').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '1.您是自己前来游玩还是和朋友或者家人一起来的？'
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: container1Data
        }]
    });
    
    $('#container2').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '2.您是否拥有PS4游戏机？'
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: container2Data
        }]
    });
    
    $('#container3').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '3.您多久来一次星奇点？'
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: container3Data
        }]
    });
    
    $('#container4').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '4.您的年龄大约在？'
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: container4Data
        }]
    });
});

// [{"friend": 50},{"alone":80},{"family":20}]