var weiboInfo = window.weiboInfo;
var userCounts = window.userCounts;
$(document).ready(function(){
    var dataTableBody = $("#datatable_weibo tbody");
    //总微博篇数
    var total_number = weiboInfo.total_number;
    //最新微博的详细信息
    var html = "";
    weiboInfo.map(function(item, index){
        var status = item.status.substring(0, 60);
        var date = formatDate(item.publishAt);
        html +="<tr><td>" + date + "</td><td>" + status + "</td><td>" + item.readTimes + "</td><td>" + item.readAmounts+ "</td><td>" + item.interAmounts + "</td><td><i class='fa fa-search' aria-hidden='true'></i><a id='detailBtn'" + index +  "href='#'> 查看详情</a></td></tr>";
    //   return {
    //       text: item.text,
    //       reposts_count: item.reposts_count,
    //       comments_count: item.comments_count,
    //       created_at: item.created_at
    //   };
    });
    
    dataTableBody.html(html);
    
    $("#datatable_weibo").DataTable({
        'order': [[ 0, 'desc' ]],
        'drawCallback': function(settings) {
            console.log('draw complete!');
            
            $("[id^=detailBtn]").on('click', function () {
               console.log($(this).attr("id")); 
            });
        }
    });
    // 处理粉丝数据变化
    handleFansData(userCounts);
    // 初始化粉丝图表
    initialFansContainer([5,2,1,1,1,1,1],[0, 0, 0, 0, 0, 0, 0]);
});


/**
 * 处理粉丝数据变化
 * 
 * @param   {Array}    userCounts      每天的用户相关数据：粉丝，好友，发布微博数
 * @return  {Array}    fansData        每天粉丝的数据变化
 */
 function handleFansData(userCounts) {
    var fansData = [];
    fansData = userCounts.map(function(item) {
        return item.followers_count;
    });
    return fansData;
 }

/**
 * 格式化日期
 * 
 * @param     {String}    date      "2017年3月31日晚上6点43分"
 * @return    {String}              返回日期字符串"2016-08-23"
 */
function formatDate(date) {
    var year = date.substr(0,4);
    var indexOfYear = date.indexOf("年");
    var indexOfMonth = date.indexOf("月");
    var indexOfDate = date.indexOf("日");
    
    var month = date.substr(5, indexOfMonth - indexOfYear - 1);
    var monthLength = indexOfMonth - indexOfYear;
    var day = date.slice(indexOfMonth + 1, indexOfDate);
    if(month.length === 1) {
        month = '0' + month;
    }
    if(day.length === 1) {
        day = '0' + day;
    }
    return year + "-" + month + '-' + day + ' ' + date.slice(indexOfDate + 1);
}


/**
 * 初始化粉丝数据统计
 * 
 * @param    {Array}   fansAdd        粉丝增加人数
 * @param    {Array}   fansReduce     粉丝减少人数
 */

function initialFansContainer(fansAdd, fansReduce) {
    
    var fansNetAdd = [];
    for(var i = 0; i < fansAdd.length; i++) {
        fansNetAdd[i] = fansAdd[i] + fansReduce[i];
    }
    
    // Initial fans charts
    $('#fansContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '粉丝趋势分析'
        },
        xAxis: {
            categories: [
                moment().add(-7, 'days').format("L"),
                moment().add(-6, 'days').format("L"),
                moment().add(-5, 'days').format("L"),
                moment().add(-4, 'days').format("L"),
                moment().add(-3, 'days').format("L"),
                moment().add(-2, 'days').format("L"),
                moment().add(-1, 'days').format("L")]
        },
        yAxis: {
          labels: {
            format: '{value} 人',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
            },
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'column',
            name: '粉丝增加',
            data: fansAdd
        }, {
            type: 'column',
            name: '粉丝减少',
            data: fansReduce
        }, {
            type: 'spline',
            name: '粉丝净增',
            data: fansNetAdd,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }]
    });
}
