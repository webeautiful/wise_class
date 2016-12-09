import Highcharts from 'highcharts'

class ChartService {

  constructor() {
    this.Highcharts = Highcharts;
    this.init();
  }

  init() {
  }

  initFinalScore() {
    var options = 
    {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: '得分'
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: [1, 2, 3, 4, 5, 6,
                7, 8, 9, 10, 11, 12],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}人',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: '(提交)',
                align: 'high',
                rotation: 0,
                style: {
                    color: Highcharts.getOptions().colors[2]
                },
                x: -45,
                y: -20
            },
            opposite: true
        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: '(平均分)',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} 分',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Sea-Level Pressure',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value} mb',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true,
            visible: false
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: '人数',
            type: 'column',
            yAxis: 1,
            data: [3, 10, 13, 18, 21, 27, 33, 36, 42, 54, 48, 42],
            tooltip: {
                valueSuffix: ' 人'
            }
        }, {
            name: '初版',
            type: 'spline',
            data: [7.5, 8.5, 9.5, 14.5, 18.5, 21.5, 25.5, 26.5, 23.5, 25, 29, 30],
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' 分'
            }
        }, {
            name: '终板',
            type: 'spline',
            data: [16, 20, 36, 40, 43, 52, 56, 61, 67, 69, 82, 89],
            tooltip: {
                valueSuffix: ' 分'
            }
        }]
    }
    var chart = this.Highcharts.chart('chart', options);
  }

}

export default ChartService
