import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

class ConfigureAsset {
  path: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class ConfigServiceService {
  configure: any = {}

  constructor(private http: HttpClient) { }

  public getSpecificConfigure(type: string): any {
    return this.configure[type];
  }

  public loadConfigure(assets: ConfigureAsset[]): Promise<boolean> {
    let assetsCount = 0;
    return new Promise<boolean>((resolve, reject) => {
      assets.forEach(async (asset) => {
        this.configure[asset.type] = await this.http.get<any>(asset.path)
          .toPromise();

        if (asset.type == 'datasources') {
          sessionStorage.setItem('config', JSON.stringify(this.configure[asset.type]))
        }

        assetsCount++;
        if (assetsCount === assets.length) {
          resolve(true);
        }
      });
    });
  }
}
