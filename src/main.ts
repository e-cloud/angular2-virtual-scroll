import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as MenuSpy from 'menuspy';

import './rxjs-extensions';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const elm = document.querySelector('#menu');
const ms = new MenuSpy(elm);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
