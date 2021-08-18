import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestManager, SecurityTokenProvider } from 'fancy-hateoas-client';

/**
 * A special angular implementation for the RequestManager using angulars HttpClient.
 */
export class AngularRequestManager extends RequestManager {

    constructor(private _httpClient: HttpClient, private _tokenProvider: SecurityTokenProvider) {
        super();
    }

    protected async request(method: 'GET' | 'PUT' | 'POST' | 'DELETE', url: string, body?: any): Promise<any> {
        let securityToken: string | null = null
        
        if(this._tokenProvider) {
            securityToken = await this._tokenProvider.retrieveCurrentToken();
        }
        
        let requestPromise = new Promise((resolve, reject) => {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');

            if(securityToken) {
                headers = headers.set('Authorization', 'Bearer ' + securityToken);
            }

            this._httpClient.request(method, url, { body, headers }).subscribe({ 
                next: response => {
                    resolve(response); 
                },
                error: response => {
                    reject(response);
                } });
        });

        return await requestPromise;
    }
}
