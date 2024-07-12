declare module '*.less' {
    const content: { [className: string]: string };
    export default content;
}

declare var React: typeof import('react');
declare namespace React {
    export interface Attributes {
        children?: any;
    }
}

