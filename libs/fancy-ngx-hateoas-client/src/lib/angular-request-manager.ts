import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestManager, SecurityTokenProvider } from "fancy-hateoas-client";
import { firstValueFrom } from 'rxjs';
import { AngularRequestManagerOptions } from './provide';
import { Router } from '@angular/router';

/**
 * A special angular implementation for the RequestManager using angulars HttpClient.
 */
export class AngularRequestManager extends RequestManager {

    private _httpClient = inject(HttpClient) 
    private _tokenProvider = inject(SecurityTokenProvider, { optional: true});
    private _router = inject(Router);

    constructor(private options: AngularRequestManagerOptions) {
        super();
    }

    protected async request(method: 'GET' | 'PUT' | 'POST' | 'DELETE', url: string, body?: any): Promise<any> {
        let securityToken: string | null = null
        
        if(this._tokenProvider) {
            securityToken = await this._tokenProvider.retrieveCurrentToken();
        }
        
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

        try {
            let response = await firstValueFrom(this._httpClient.request(method, url, { body, headers }));
            return response;
        } catch(errorResponse: any) {
            if(errorResponse.status === 401) {
                this.options.onUnauthorizedAction(this._router);
            } else {
                throw errorResponse;
            }
        }
    }

    private getXsrfCookie(cookieName?: string) {
        let name=cookieName || 'XSRF-TOKEN';
        const o=document.cookie.split(";").map(t=>t.trim()).filter(t=>t.startsWith(name+"="));
        return 0===o.length?null:decodeURIComponent(o[0].split("=")[1]);
    }
}
