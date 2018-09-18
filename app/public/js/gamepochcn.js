$(function () {
    var news = $("#CNNewsLabel").text();
    var mapData = $("#mapLabel").text();
    mapData = JSON.parse(mapData);
    //console.log(mapData[0]);
    var newsList = JSON.parse(news);
    var newsIds = [];
    var newsSum = [];
    // Y 轴数据
    newsIds = newsList.map((item, index) => {
       return index+1; 
    });
    // X 轴数据
    newsSum = newsList.map(item => {
       return item.sum; 
    });
    
    var chart = Highcharts.chart({  
        chart: {
            type: 'bar',
            animation: Highcharts.svg,
            marginRight: 20,
            renderTo: 'container',
            events: {
                load: function () {
                  var series = this.series[0];
                  setInterval(function(){
                      for(var i = 0; i < newsList.length; i++) {
                        series.data[i].update(getSumData()[i]);
                      }
                  }, 3000);
                  
                }
            }
        },
        title: {
            text: '文章实时访问量'
        },
        subtitle: {
            text: '数据来源星游纪官网: http://www.gamepoch.cn'
        },
        xAxis: {
            categories: newsIds,
            title: {
                text: '文章id'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '文章阅读总量(次数)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' 次数'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'bottom',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '阅读次数',
            data: newsSum
        }]
    });
    
    /**
     *  获取文章实时访问数据
     */
    function getSumData() {
        var promise = [];
        for(var i = 0; i < newsList.length; i++) {
            promise.push(axios.get('/api/newslogs?source=gamepoch.cn&newsId=' + newsList[i].id));
        }
        Promise.all(promise).then((results) => {
           results.forEach((item,index) => {
              //console.log(item.data.length);
              newsSum[index] = item.data.length; 
           });
        }).catch(e => {
           console.log(e);
           return null;
        });
        return newsSum;
    }
    
    /**
     * 获取地图数据
     */
    function getMapData() {
       
    }
    
    /*
     mapData = [
        {
            "hc-key": "cn-sh",
            "value": 1
        },
        {
            "hc-key": "cn-zj",
            "value": 3
        },
        {
            "hc-key": "cn-js",
            "value": 13
        },{
            "hc-key": "cn-xz",
            "value": 2
        }
    ];
    */
    // Initiate the map chart
    $('#container-map').highcharts('Map', {
        chart: {
            events: {
                load: function () {
                  var series = this.series[0];
                  setInterval(function(){
                       axios.get('/api/newslogs/mapData?source=gamepoch.cn').then((response) => {
                            mapData = response.data;
                            if(mapData) {
                                for(var i = 0; i < mapData.length; i++) {
                                    series.data[i].update(mapData[i]);
                                }   
                              }
                            }).catch(e => {
                                console.log(e);
                            });
                  }, 3000);
                }
            },
            animation: false
        },

        title : {
            text : '访问星游纪中文官网的用户访问量'
        },

        subtitle : {
            //text: '该数据'
            //text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar-taiwan.js">China with Hong Kong, Macau, and Taiwan</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : mapData,
            mapData: Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan'],
            joinBy: 'hc-key',
            name: '用户数：',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
