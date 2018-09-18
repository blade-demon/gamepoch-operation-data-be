$(function () {
    var news = $("#kofNewsLabel").text();
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
                  }, 10000);
                  
                }
            }
        },
        title: {
            text: '文章实时访问量'
        },
        subtitle: {
            text: '数据来源拳皇14官网: http://kof.gamepoch.com'
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
    
    
    function getSumData() {
        var promise = [];
        for(var i = 0; i < newsList.length; i++) {
            promise.push(axios.get('/api/newslogs?source=kof&newsId=' + newsList[i].id));
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
});
