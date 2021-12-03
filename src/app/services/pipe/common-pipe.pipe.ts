import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFileName'
})
export class GetFileNamePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.split('/').pop();
  }

}

@Pipe({
  name: 'addNum'
})
export class AddNamePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    return value + 3;
  }

}
