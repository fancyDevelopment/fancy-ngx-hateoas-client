import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HateoasClient, SecurityTokenProvider, RequestManager, SignalRSocketManager, SocketManager } from 'fancy-hateoas-client';
import { AngularRequestManager } from './angular-request-manager';

export function requestManagerFactory (httpClient: HttpClient, tokenProvider: SecurityTokenProvider) { 
  return new AngularRequestManager(httpClient, tokenProvider); 
}

export function hateoasClientFactory (rm: RequestManager, sm: SocketManager) { 
  return new HateoasClient(rm, sm); 
}

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: []
})
export class HateoasClientModule {
  public static forRoot(config: { sendSecurityToken: boolean } | null = null): ModuleWithProviders<HateoasClientModule> {

    // Create an array of default providers
    let providers: Provider[] = [
      { 
        provide: SocketManager, 
        useClass: SignalRSocketManager 
      },
      { 
        provide: HateoasClient, 
        useFactory: hateoasClientFactory,
        deps: [RequestManager, SocketManager]
      }
    ];

    if(config?.sendSecurityToken) {
      // Register request manager with a dependency to a security token provider
      providers.push({ 
        provide: RequestManager, 
        useFactory: requestManagerFactory,
        deps: [HttpClient, SecurityTokenProvider]
      });
    } else {
      // Register request manager without a dependency to a security token provider
      providers.push({ 
        provide: RequestManager, 
        useFactory: requestManagerFactory,
        deps: [HttpClient]
      });
    }

    return {
      ngModule: HateoasClientModule,
      providers
    };
  }
}
