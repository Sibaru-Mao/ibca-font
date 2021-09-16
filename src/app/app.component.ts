import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  language: string = 'tc'

  constructor(public translate: TranslateService) {
    this.changeLanguage(this.language)
  }

  changeLanguage(data) {
    this.language = data
    this.translate.addLangs(["tc", "en"]);
    this.translate.setDefaultLang('tc');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/tc|en/) ? browserLang : this.language);
  }

}

