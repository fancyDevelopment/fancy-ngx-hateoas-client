import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestManager } from 'fancy-hateoas-client';

/**
 * A special angular implementation for the RequestManager using angulars HttpClient.
 */
export class AngularRequestManager extends RequestManager {

    constructor(private httpClient: HttpClient) {
        super();
    }

    protected request(method: 'GET' | 'PUT' | 'POST' | 'DELETE', url: string, body?: any): Promise<any> {
        return new Promise(resolve => {
            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            this.httpClient.request(method, url, { body, headers }).subscribe(response => {
                resolve(response);
            });
        });
    }
}
