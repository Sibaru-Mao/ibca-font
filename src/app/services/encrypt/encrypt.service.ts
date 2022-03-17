import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  encrypt(pValue) {
    return pValue.replace(/[^\u0000-\u00FF]/g, function ($0) {
      return escape($0).replace(/(%u)(\w{4})/gi, "-$2@")
    });
  }

  decode(pValue) {
    return unescape(pValue.replace(/-/g, '%u').replace(/\\u/g, '%u').replace(/@/g, ''));
  }

}
