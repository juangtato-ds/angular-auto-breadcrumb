/**
 * Data structure for dynamic label actual label messages.
 */
export interface BreadcrumbDynamicLabel {
    /**
     * Unique-code to be replaced
     */
    dynamicCode: string;
    /**
     * I18n label or text to be displayed for the route.
     */
    label: string;
}

/**
 * Additional route configuration for Breadcrumb component
 */
export interface BreadcrumbRouteConfig {
    /** Static text or i18n label for the current route */
    label: string;
    /** Unique-code to manage label text dynamically.*/
    dynamicCode?: string;
    /** Label should be displayed without link option */
    nolink?: boolean;
}

/**
 * Calculated data for each route / item of the breadcrumb at a particular time
 */
export interface BreadCrumbItem {
    /** Default label, as is present in route configuration */
    defaultLabel: string;
    /** Current label, is there was an update from the breadcrumb-service */
    label: string;
    /** Url to be placed as link */
    url: string;
    /** Dynamic-code as present in the route configuration */
    dynamicCode?: string;
    /** No-link flag, as present in the route configuration */
    nolink: boolean;
}
