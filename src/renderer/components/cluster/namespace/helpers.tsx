export const formatStatus = (status: string | undefined): JSX.Element => {
    if (!status) return <span>-</span>;

    let statusColor = 'text-gray-600';
    if (status === 'Active') statusColor = 'text-green-600';
    else if (status === 'Terminating') statusColor = 'text-red-600';

    return <span className={ statusColor }> { status } </span>;
};