import { Status } from "@protoku/design-system";

export const formatStatus = (statusText: string | undefined): JSX.Element => {
    if (!statusText) return <span>-</span>;

    return <Status variant={ statusText === 'Active' ? 'success' : 'default' }>{ statusText }</Status>;
};