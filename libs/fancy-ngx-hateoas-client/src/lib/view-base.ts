import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ViewModelReloader } from './view-model-reloader';
import { ResourceBase, HateoasClient } from 'fancy-hateoas-client';
import { Directive, inject } from '@angular/core';

/**
 * Base class for angular components which represent a view and are backed by a hateoas resource.
 */
@Directive()
export abstract class TypedViewBase<TViewModel extends ResourceBase> implements ViewModelReloader {

  /**
   * A subject which gets triggered each time a new view model was loaded.
   */
  private _viewModelLoadedSubject = new Subject<ResourceBase>();

  /**
   * The url of the view model of this instance.
   */
  protected viewModelUrl: string | undefined;

  /**
   * The activated route service.
   */
  protected activatedRoute = inject(ActivatedRoute);

  /**
   * The hateoas client.
   */
  protected hateoasClient = inject(HateoasClient);

  /**
   * A public observable to be used to subscribe to the view model loaded subject.
   */
  public viewModelLoaded$ = this._viewModelLoadedSubject.asObservable();

  /**
   * The current view model.
   */
  public viewModel: TViewModel | null = null;

  constructor() {
    // Subscribe to current url and load corresponding view model
    this.activatedRoute.params.subscribe(params => {
      this.viewModelUrl = params['url'];
      this.reloadViewModel();
    });
  }

  /**
   * Reloads the current view model.
   */
  async reloadViewModel(): Promise<ResourceBase> {
    if (this.viewModelUrl) {
        this.viewModel = await this.hateoasClient.fetch(this.viewModelUrl) as TViewModel;
        this.viewModelOnLoaded();
        this._viewModelLoadedSubject.next(this.viewModel);
        return this.viewModel;
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

/**
 * Base class for angular components which represent a untyped view and are backed by a hateoas resource.
 */
@Directive()
export abstract class ViewBase extends TypedViewBase<ResourceBase> {
}
