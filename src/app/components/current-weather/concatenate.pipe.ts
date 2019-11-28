import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatenate'
})
export class ConcatenatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(value){
    return value + args[0];
    }
  }

}
