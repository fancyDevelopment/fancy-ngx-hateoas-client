import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ViewModelReloader } from './view-model-reloader';
import { NgxHateoasClient } from './ngx-hateoas-client.service';
import { ResourceBase } from '../../../../../fancy-hateoas-client/src/resource';

/**
 * Base class for angular components which represent a view and are backed by a hateoas resource.
 */
export abstract class ViewBase implements ViewModelReloader {

    /**
     * the url of the view model of this instance.
     */
    protected viewModelUrl: string | null = null;

    /**
     * The current view model.
     */
    protected viewModel: ResourceBase | ResourceBase[] | null = null;

    /**
     * A subject which gets triggered each time a new view model was loaded.
     */
    protected viewModelLoadedSubject = new Subject<ResourceBase | ResourceBase[]>();

    /**
     * A public observable to be used to subscribe to the view model loaded subject.
     */
    public viewModelLoaded = this.viewModelLoadedSubject.asObservable();

    constructor(protected activatedRoute: ActivatedRoute, protected hateoasClient: NgxHateoasClient) {
        // Subscribe to current url and load corresponding view model
        this.activatedRoute.params.subscribe(params => {
            this.viewModelUrl = params.url;
            this.reloadViewModel();
         });
     }

    /**
     * Reloads the current view model.
     */
    reloadViewModel(): Promise<ResourceBase | ResourceBase[]> {
        if (this.viewModelUrl) {
            const fetchPromise = this.hateoasClient.fetch(this.viewModelUrl);
            fetchPromise.then(data => {
                this.viewModel = data;
                this.viewModelOnLoaded();
                this.viewModelLoadedSubject.next(data);
            });
            return fetchPromise;
        } else {
            return Promise.resolve({});
        }
    }

    /**
     * A life cycle hook to use when the implementing class needs to know when a new view model is availalbe.
     */
    viewModelOnLoaded(): void {
        // Empty default implementation
    }
}
