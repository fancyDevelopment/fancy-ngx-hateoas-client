import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HateoasClient, RequestManager, SignalRSocketManager, SocketManager } from 'fancy-hateoas-client';
import { AngularRequestManager } from './angular-request-manager';

export function requestManagerFactory (httpClient: HttpClient) { return new AngularRequestManager(httpClient); }
export function hateoasClientFactory (rm: RequestManager, sm: SocketManager) { return new HateoasClient(rm, sm); }

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
        { 
          provide: RequestManager, 
          useFactory: requestManagerFactory,
          deps: [HttpClient]
        },
        { 
          provide: SocketManager, 
          useClass: SignalRSocketManager 
        },
        { 
          provide: HateoasClient, 
          useFactory: hateoasClientFactory,
          deps: [RequestManager, SocketManager]
        }
      ]
    };
  }
}
