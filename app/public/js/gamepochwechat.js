var articlesummary = window.getarticlesummary;
var articletotal = window.getarticletotal;

// set moment.js
moment.locale('zh-CN', {
  longDateFormat: {
    L: "YYYY-MM-DD"
  }
});

$(document).ready(function() {
    // 当前日期的前一天
    var currentDate = new Date(new Date().getTime() - 3600*1000*24 * 1);
    
    // 初始化日期选择
    initialDateRangePicker(currentDate);
    // 设置图文消息列表
    setTableData(articlesummary, articletotal);
    
    // 设置图表
    //populateCharts(articletotal);  
    
    // 数据概况的数据是否被点击，点击后其父元素的父元素的兄弟元素是否是隐藏
    $("#newsList tbody > tr > td > a").on('click', function(){
        var tableItem = $(this).parent().parent().siblings();
        var index = parseInt($(this).attr('id').slice(7));
        console.log(articletotal[index]);
    });
});

/**
 * 初始化日期控件
 * 
 * @param {Date}  currentDate   当前时间的前一天
 * 
 */
function initialDateRangePicker(currentDate) {
    var month = currentDate.getMonth() + 1;
    var date = currentDate.getDate();
    if(month < 10) {
        month = "0" + month;
    }
    if(date < 10) {
        date = "0" + date;
    }
    
    $('#reportrange span').html(currentDate.getFullYear() + '-' + month + '-' + date);
    $('#reportrange').daterangepicker({
        startDate: moment().add(-1, "days").format("l"),
        endDate: moment().add(-1, "days").format("l"),
        maxDate: moment().add(-1, "days").format("l"), //最大时间
        dateLimit : {  
            days : 1
        },
        singleDatePicker: true,
        locale : {  
            applyLabel : '确定',  
            cancelLabel : '取消',  
            fromLabel : '起始时间',  
            toLabel : '结束时间',  
            customRangeLabel : '自定义',  
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],  
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],  
            firstDay : 1  
        } 
    }, function(start, end) {
        $('#reportrange span').html(start.format('YYYY-MM-DD'));
        getNewData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    });
}

/**
 * 获取图文群发每日数据和获取图文群发总数据
 * 
 * @param {String} start 日期开始的时间
 * @param {String} end   日期的结束时间
 * 
 */
function getNewData(start, end) {
    var p1 = axios.get(`/api/wechat/getarticlesummary?startDate=${start}&endDate=${end}`);
    var p2 = axios.get(`/api/wechat/getarticletotal?startDate=${start}&endDate=${end}`);
    Promise.all([p1, p2]).then((response)=>{
        articlesummary = response[0].data;
        articletotal = response[1].data;
        setTableData(articlesummary, articletotal);
        
        $("#newsList tbody > tr > td > a").on('click', function(){
            var tableItem = $(this).parent().parent().siblings();
            var index = parseInt($(this).attr('id').slice(7));
            console.log(articletotal[index]);
            // $("#articleTitleLabel").text(articletotal[index]);
            populateCharts(articletotal.list[index]);
        });
    }).catch(e => {
        console.log(e.response);
    });
}

/**
 * 设置Table的数据，显示每天的各个图文消息的情况
 * 
 * @param       {String}       getarticlesummary  获取图文群发每日数据
 * @param       {String}       getarticletotal    图文群发总数据
 */

function setTableData(getarticlesummary, getarticletotal) {
    var innerString = "";
    var articleTitleArray = [];
    if(getarticletotal.list.length > 0) {
        for(var i = 0; i < getarticletotal.list.length; i++) {
            articleTitleArray.push(getarticletotal.list[i].title);
        }
        console.log(articleTitleArray);
    }
    
    if(getarticlesummary.list) {
        var length = getarticlesummary.list.length;
        console.log(length);
        for(var i = 0; i < length; i++) {
            var itemTemplate = '';
            if(articleTitleArray.indexOf(getarticlesummary.list[i].title) >= 0) {
                console.log(getarticlesummary.list[i].title);
                itemTemplate = 
                    `<tr class="pointer collapsed">
                        <td class=" ">${getarticlesummary.list[i].title}</td>
                        <td class=" ">${getarticlesummary.list[i].ref_date}</td>
                        <td class=" ">${getarticlesummary.list[i].int_page_read_user}</td>
                        <td class=" ">${getarticlesummary.list[i].int_page_read_count}</td>
                        <!--td class=" ">${getarticlesummary.list[i].add_to_fav_user}</td>
                        <td class=" ">${getarticlesummary.list[i].add_to_fav_count}</td>
                        <td class=" ">${getarticlesummary.list[i].share_user}</td>
                        <td class=" ">${getarticlesummary.list[i].share_count}</td>
                        <td class=" ">${getarticlesummary.list[i].ori_page_read_user}</td>
                        <td class=" ">${getarticlesummary.list[i].ori_page_read_count}</td>
                        <td class=" ">${getarticlesummary.list[i].user_source}</td-->
                        <td class=" "><a class="collapsed" role="tab" id="heading${articleTitleArray.indexOf(getarticlesummary.list[i].title)}" data-toggle="collapse" data-parent="#accordion" href="#collapsePanel" aria-expanded="false" aria-controls="collapsePanel">数据概况 <b class="caret"></b></a></td>
                    </tr>`;
            } else {
                console.log("没有详细信息");
                itemTemplate = 
                    `<tr class="pointer collapsed">
                        <td class=" ">${getarticlesummary.list[i].title}</td>
                        <td class=" ">${getarticlesummary.list[i].ref_date}</td>
                        <td class=" ">${getarticlesummary.list[i].int_page_read_user}</td>
                        <td class=" ">${getarticlesummary.list[i].int_page_read_count}</td>
                        <td class=" ">暂无7天详细数据</td>
                    </tr>`;
            }
            innerString += itemTemplate;
        }
    }
    $("#newsList tbody").html(innerString);
}


/**
 * 初始化图表：饼图和折线图
 * 
 * @param {String} data  图文群发总数据
 */
function populateCharts(data) {
    console.log(data);
    $("#articleTitleLabel").text(data.title).show();
    if(data.details) {
        // 统计时间段
        var dateArray = [];
        // 每日数据
        var dailyDataCharts = data.details.map((item, index) => {
            dateArray.push(item.stat_date.slice(5));
            if(index === 0) {
                return item.int_page_read_user;     
            } else {
                return data.details[index].int_page_read_user - data.details[index - 1].int_page_read_user;
            }
        });
        //console.log("最后一天的数据：" + JSON.stringify(data.details[data.details.length-1]));
        var lastDayData = data.details[data.details.length-1];
        
        
        // 阅读来源分布饼图
        $('#container1').highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: '图文页来源分布'
            },
            subtitle: {
                text: '阅读总数：'
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
                        style:{
                           //color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || 'black'   
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: '图文页来源分布',
                data: [["公众号会话" ,lastDayData.int_page_from_session_read_user], 
                        ["好友转发",lastDayData.int_page_from_friends_read_count ],
                        ["朋友圈", lastDayData.int_page_from_feed_read_user],
                        ["历史消息", lastDayData.int_page_from_hist_msg_read_user],
                        ["其它", lastDayData.int_page_from_other_read_user]
                      ]
            }]
        });
        // 阅读发展趋势
        $('#container2').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '图文页阅读人数'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: dateArray
            },
            yAxis: {
                title: {
                    text: '人数 (个)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                backgroundColor: 'white',     // 背景颜色
                borderColor: 'black',         // 边框颜色
                borderWidth: 1,               // 边框宽度
                shadow: true,                 // 是否显示阴影
                animation: true,              // 是否启用动画效果
                valueSuffix: '个',
                style: {                      // 文字内容相关样式
                    color: "#73879C",
                    fontSize: "12px",
                    fontWeight: "blod",
                    fontFamily: "Courir new"
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true          // 开启数据标签
                    },
                    enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                }
            },
            series: [{
                name: '图文页阅读人数',
                data: dailyDataCharts
            }]
        });
        
        // 设置图文7天数据详情
        setDataDetailTable(data.details);
    }
}



/**
 * 设置图文消息每天的详细数据
 * @param {String} data  每天的数据图文消息详情
 */
 function setDataDetailTable(data) {
     var htmlString = "";
     data.map(function(item, index) {
        if(index === 0) {
            htmlString += 
            `<tr>
              <td>${item.stat_date}</td>
              <td>${item.int_page_read_user}</td>
              <td>${item.int_page_from_session_read_user }</td>
              <td>${item.int_page_from_feed_read_user}</td>
              <td>${item.int_page_from_friends_read_user}</td>
              <td>${item.add_to_fav_user}</td>
            </tr>`; 
        } else {
           htmlString += 
            `<tr>
              <td>${item.stat_date}</td>
              <td>${item.int_page_read_user - data[index-1].int_page_read_user}</td>
              <td>${item.int_page_from_session_read_user - data[index-1].int_page_from_session_read_user}</td>
              <td>${item.int_page_from_feed_read_user - data[index-1].int_page_from_feed_read_user}</td>
              <td>${item.int_page_from_friends_read_user - data[index-1].int_page_from_friends_read_user}</td>
              <td>${item.add_to_fav_user - data[index-1].add_to_fav_user}</td>
            </tr>`; 
        }
     });
     
     $("#dataDetail tbody").html(htmlString);
}
