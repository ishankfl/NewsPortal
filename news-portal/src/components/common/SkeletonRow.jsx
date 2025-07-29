export const SkeletonRow = () => (
    <tr className="skeleton-row">
        <td className="table-cell"><div className="skeleton-bar" /></td>
        <td className="table-cell"><div className="skeleton-bar" /></td>
        <td className="table-cell"><div className="skeleton-bar-small" /></td>
        <td className="table-cell"><div className="skeleton-toggle" /></td>
        <td className="table-cell flex gap-3">
            <div className="skeleton-icon" />
            <div className="skeleton-icon" />
        </td>
    </tr>
);