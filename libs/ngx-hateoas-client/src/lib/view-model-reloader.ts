import { ResourceBase } from "../../../../../fancy-hateoas-client/src/resource";

/**
 * An interface to an object which is able to reload the current view model.
 */
export interface ViewModelReloader {
    reloadViewModel(): Promise<ResourceBase>;
}