import { EnvironmentProviders, Provider, inject, makeEnvironmentProviders } from "@angular/core";
import { AxiosRequestManager, HateoasClient, RequestManager, SignalRSocketManager } from "fancy-hateoas-client";
import { AngularRequestManager } from "./angular-request-manager";
import { Router } from "@angular/router";

export enum HateoasClientFeatureKind {
    AxiosRequestManager,
    AngularRequestManager
}

export interface HateoasClientFeature {
    kind: HateoasClientFeatureKind;
    providers: Provider[];
}

export interface AngularRequestManagerOptions {
    onUnauthorizedAction: (router: Router) => void;
}

const defaultAngularRequestManagerOptions: AngularRequestManagerOptions = {
    onUnauthorizedAction: () => {
        // Redirect to sign in 
        const currentUrl = window.location.href;
        window.location.href = '/login?redirectUrl=' + encodeURIComponent(currentUrl);
    }
};
 
export function withAxiosRequestManager(): HateoasClientFeature {
    return {
        kind: HateoasClientFeatureKind.AxiosRequestManager,
        providers: [
            {
                provide: RequestManager,
                useFactory: () => new AxiosRequestManager()
            }
        ]
    }
}

export function withAngularRequestManager(options?: Partial<AngularRequestManagerOptions>): HateoasClientFeature {
    if(!options) {
        options = {};
    }
    return {
        kind: HateoasClientFeatureKind.AngularRequestManager,
        providers: [
            {
                provide: RequestManager,
                useFactory: () => new AngularRequestManager({...defaultAngularRequestManagerOptions, ...options})
            }
        ]
    }
}

export function provideHateoasClient(...features: HateoasClientFeature[]): EnvironmentProviders {

    // Validate features
    if(features?.length != 1) {
        throw new Error("You need to specifiy either the 'AxiosRequestManager' or the 'AngularRequestManager'");
    }

    return makeEnvironmentProviders([
        {
            provide: HateoasClient,
            useFactory: () => new HateoasClient(inject(RequestManager), new SignalRSocketManager())
        },
        // Add providers from services
        features?.map(f => f.providers)
    ]);
}
