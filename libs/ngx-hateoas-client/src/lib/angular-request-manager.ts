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
            let headers = new HttpHeaders()
                              .set('Content-Type', 'application/json')
                              .set('X-Requested-With', 'XmlHttpRequest');


            if(securityToken) {
                headers = headers.set('Authorization', 'Bearer ' + securityToken);
            }

            if(method !== 'GET') {
                const xsrfToken = this.getXsrfCookie();

                if(xsrfToken) {
                    headers = headers.set('X-XSRF-TOKEN', xsrfToken);
                }
            }

            this._httpClient.request(method, url, { body, headers }).subscribe({ 
                next: response => {
                    resolve(response); 
                },
                error: response => {
                    if(response.status === 401) {
                        // Need to redirect to sign in 
                        const currentUrl = window.location.href;
                        window.location.href = '/login?redirectUrl=' + encodeURIComponent(currentUrl);
                    }
                    reject(response);
                } });
        });

        return await requestPromise;
    }

    private getXsrfCookie(cookieName?: string) {
        let name=cookieName || 'XSRF-TOKEN';
        const o=document.cookie.split(";").map(t=>t.trim()).filter(t=>t.startsWith(name+"="));
        return 0===o.length?null:decodeURIComponent(o[0].split("=")[1]);
    }
}
