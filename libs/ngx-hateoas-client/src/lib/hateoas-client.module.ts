import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RequestManager, SignalRSocketManager, SocketManager } from '@fancy/hateoas-client';
import { NgxRequestManager } from './ngx-request-manager';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: []
})
export class HateoasClientModule {
  public static forRoot(): ModuleWithProviders<HateoasClientModule> {
    return {
      ngModule: HateoasClientModule,
      providers: [
        { provide: RequestManager, useClass: NgxRequestManager },
        { provide: SocketManager, useClass: SignalRSocketManager }
      ]
    };
  }
}
