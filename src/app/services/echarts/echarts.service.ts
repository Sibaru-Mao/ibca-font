import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EchartsService {
  fontColor = '#30eee9';

  option1 = {
    backgroundColor: 'rgba(33, 48, 51, 100)',
    grid: {
      top: '25%',
      right: '0%',
      left: '5%',
      bottom: '16%'
    },
    xAxis: [{
      type: 'category',
      color: '#59588D',
      data: ['WKS-P5', 'WKS-P6A', 'WKS-P6B', 'WMY', 'WOK', 'WZS-8', 'WTZ'],
      axisPointer: {
        type: 'line'
      },
      axisLine: {
        lineStyle: {
          color: '#272456'
        }
      },
      axisLabel: {
        margin: 20,
        color: '#B3C0C9',
        textStyle: {
          fontSize: 12
        },
      },
    }],
    yAxis: [{
      min: 0,
      max: 25,
      axisLabel: {
        formatter: '{value}',
        color: '#B4C1CA',
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#2E4449'
        }
      }
    }],
    series: [{
      type: 'bar',
      data: [25, 10, 4, 6, 7, 8, 9],
      barWidth: '10px',
      itemStyle: {
        normal: {
          color: '#2EABE6',
          barBorderRadius: [30, 30, 0, 0],
          // shadowColor: 'rgba(0,255,225,1)',
          // shadowBlur: 4,
        }
      },
      label: {
        normal: {
          show: true,
          lineHeight: 20,
          // width: 80,
          height: 20,
          // backgroundColor: '#252453',
          borderRadius: 200,
          position: ['-2', '-20'],
          distance: 1,
          formatter: [
            // '    {d|●}',
            ' {a|{c}}     \n',
            '    {b|}'
          ].join(''),
          rich: {
            d: {
              color: '#3CDDCF',
            },
            a: {
              color: '#fff',
              align: 'center',
            },
            // b: {
            //   width: 1,
            //   height: 30,
            //   borderWidth: 1,
            //   borderColor: '#234e6c',
            //   align: 'left'
            // },
          }
        }
      }
    }]
  };

  option2 = {
    backgroundColor: 'rgba(33, 48, 51, 100)',
    title: {
      text: '空壓群控系統  WKS-P5異常節點次數佔比',
      left: 'center',
      top: 0,
      textStyle: {
        color: 'rgba(78, 187, 187, 100)',
        fontSize: 14,
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    visualMap: {
      show: false,
      min: 200,
      max: 600,
      inRange: {
        // colorLightness: [0, 1]
      }
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      center: ['50%', '50%'],
      color: ['rgb(131,249,103)', '#FBFE27', '#FE5050', '#1DB7E5'], //'#FBFE27','rgb(11,228,96)','#FE5050'
      data: [{
        value: 0,
        name: ''
      }].sort(function (a, b) {
        return a.value - b.value
      }),
      // roseType: 'radius',
      label: {
        normal: {
          formatter: ['{c|{c}%}', '{b|{b}}'].join('\n'),
          rich: {
            c: {
              color: 'rgb(241,246,104)',
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 5
            },
            b: {
              color: 'rgb(98,137,169)',
              fontSize: 15,
              height: 40
            },
          },
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: 'rgb(98,137,169)',
          },
          smooth: 0.2,
          length: 20,
          length2: 35,
        }
      },
      itemStyle: {
        normal: {
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          shadowBlur: 50,
        }
      }
    }]
  };

  option3 = {
    backgroundColor: 'rgba(33, 48, 51, 100)',
    grid: {
      left: '5%',
      right: '10%',
      top: '10%',
      bottom: '8%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    legend: {
      show: true,
      x: 'center',
      y: '35',
      icon: 'stack',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#1bb4f6'
      },
      data: ['']
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        color: this.fontColor
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#397cbc'
        }
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#195384'
        }
      },
      data: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7',]
    }],
    yAxis: [{
      type: 'value',
      name: '',
      min: 0,
      max: 20,
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: '#2ad1d2'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#27b4c2'
        }
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#11366e'
        }
      }
    }],
    series: [{
      // name: '已采纳',
      type: 'line',
      stack: '总量',
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: '#2EABE6',
          lineStyle: {
            color: "#2EABE6",
            width: 1
          },
          //           areaStyle: { 
          //      //color: '#94C9EC'
          //      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          //        offset: 0,
          //        color: 'rgba(7,44,90,0.3)'
          //      }, {
          //        offset: 1,
          //        color: 'rgba(0,146,246,0.9)'
          //      }]),
          //           }
        }
      },
      // markPoint: {
      //   itemStyle: {
      //     normal: {
      //       color: 'red'
      //     }
      //   }
      // },
      data: [0, 0, 0, 0, 0, 0, 0]
    },
      // {
      //     name: '已发布',
      //     type: 'line',
      //     stack: '总量',
      //     symbol: 'circle',
      //     symbolSize: 8,

      //     itemStyle: {
      //         normal: {
      //             color: '#00d4c7',
      //             lineStyle: {
      //                 color: "#00d4c7",
      //                 width: 1
      //             },
      //         }
      //     },
      //     data: [220, 182, 191, 234, 290, 330, 310, 201, 154, 190, 330, 410]
      // },
    ]
  }

  option4 = {
    title: [{
      text: '0%',
      x: 'center',
      top: '24%',
      textStyle: { fontWeight: 'bold', color: '#3BAEE5', fontSize: '26' }
    },
    {
      text: '覆蓋率',
      x: 'center',
      top: '60%',
      textStyle: { fontWeight: 'normal', color: 'rgba(182, 195, 204, 100)', fontSize: '12' }
    }],
    tooltip: {
      show: false, 
      formatter: function (params) { return params.name + '：' + params.percent + ' %' }
    },
    legend: {
      show: false,
      itemGap: 12,
      data: ['占比', '剩余']
    },
    series: [{
      name: 'circle',
      type: 'pie',
      clockWise: true,
      radius: ['85%', '99%'],
      itemStyle: {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },

        },
      },
      hoverAnimation: false,
      data: [{
        value: 0,
        name: '已覆蓋',
        itemStyle: {
          normal: {
            color: { // 颜色渐变
              colorStops: [{
                offset: 0,
                color: '#3BAEE5' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#3BAEE5' // 100% 处的颜色1
              }]
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        }
      }, {
        name: '未覆蓋',
        // value: this.monitor.notMonitored,
        value: 100,
        itemStyle: {
          normal: {
            color: '#E1E8EE'
          }
        }
      }]
    }]
  }

  constructor() { }
}
