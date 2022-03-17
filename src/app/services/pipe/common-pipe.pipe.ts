import { EncryptService } from './../encrypt/encrypt.service';
import { Pipe, PipeTransform } from '@angular/core';

const encrypt = new EncryptService()

@Pipe({ name: 'getFileName' })
export class GetFileNamePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value.includes('^'))
      return encrypt.decode(value).match(/([^/]+)$/)[1]
    else
      return encrypt.decode(value).match(/([^^]+)$/)[1]
  }
}

@Pipe({ name: 'translateFileName' })
export class translateFileNamePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value)
      return value
    else if (!value.includes('^'))
      return encrypt.decode(value)
    else
      return encrypt.decode(value).match(/([^^]+)$/)[1]
  }
}

@Pipe({ name: 'batteryPlacement' })
export class BatteryPlacementPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (typeof value == 'string' && !value) {
      return ''
    } else {
      if (value == 0)
        return '与设备包装在一起'
      if (value == 1)
        return '安装在设备内'
    }
  }
}

@Pipe({ name: 'translateTransportMode' })
export class TranslateTransportModePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (value == 1)
      return '空運'
    if (value == 2)
      return '海運'
    if (value == 3)
      return '公路'
    if (value == 4)
      return '鐵路'
  }
}

@Pipe({ name: 'translateShipmentBooks' })
export class TranslateShipmentBooksPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (value == 0)
      return '生產賬冊'
    if (value == 1)
      return '維修賬冊'
  }
}

@Pipe({ name: 'translateSampleDispose' })
export class TranslateSampleDisposePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (value == 1)
      return '留樣'
    if (value == 2)
      return '退還'
    if (value == 3)
      return '其他'
  }
}

@Pipe({ name: 'taskStatus' })
export class TaskStatusPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (value == 0)
      return '已完成'
    if (value == 1)
      return '获取资料'
    if (value == 2)
      return '待RPA读取'
    if (value == 3)
      return '填写委托'
    if (value == 4)
      return '待接收'
    if (value == 5)
      return '检测中'
    if (value == 6)
      return '待上传PDF'
    if (value == 9)
      return '手动删除'
  }
}
