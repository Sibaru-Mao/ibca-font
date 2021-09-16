import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-special-chinese',
  templateUrl: './special-chinese.component.html',
  styleUrls: ['./special-chinese.component.css']
})
export class SpecialChineseComponent implements OnInit {
  @Input() id: number
  showTableData: any = []
  tableScrollHeight: string = ''
  tableHead: any = [
    { name: '序號' }, { name: '廠別：' },
    { name: '特殊架構' }, { name: '產品系列' },
    { name: '上傳人' }, { name: '上傳時間' },
    { name: '編輯' }
  ]
  searchInfo: any = { PlantCode: '', Material_No: '', Project_Code: '' }
  plant: any = JSON.parse(sessionStorage.getItem('plant'))

  constructor() { }

  ngOnInit(): void {
    this.tableScrollHeight = 0.69 * Number(sessionStorage.getItem('height')) + 'px'
    this.plant.splice(0, 1)
    let data = { data: '掌上电脑/移动式电脑/无线信息终端/便携式计算机/便携式笔记本计算机' }

    for (let index = 0; index < 100; index++) {
      this.showTableData.push(data)
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initData()
  }

  initData() {
    switch (this.id) {
      case 0:

        break;

      case 1:
        this.tableHead[2].name = '成品中文品名'
        this.tableHead[2].width = '400px'
        this.tableHead[1].name = 'Product  Name'
        break;

      default:
        break;
    }
  }

  search() {
  }
}
