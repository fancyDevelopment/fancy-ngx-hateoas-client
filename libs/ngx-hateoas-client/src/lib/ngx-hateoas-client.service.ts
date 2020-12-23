import { Injectable } from '@angular/core';
import { HateoasClient, RequestManager, SocketManager } from '@fancy/hateoas-client';
import { ResourceBase } from 'libs/hateoas-client/dist/resource';

@Injectable({
  providedIn: 'root'
})
export class NgxHateoasClient {

  private hateoasClient: HateoasClient;

  constructor(public requestManager: RequestManager, public socketManager: SocketManager) { 
    this.hateoasClient = new HateoasClient(this.requestManager, this.socketManager);
  }

  public fetch(url: string): Promise<ResourceBase | ResourceBase[]> {
    return this.hateoasClient.fetch(url);
  }
}
