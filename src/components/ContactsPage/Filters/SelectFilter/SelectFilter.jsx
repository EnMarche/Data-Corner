/* eslint-disable no-shadow,react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

// Render a select to filter inside a column
const SelectFilter = ({
    column: {
        filterValue, setFilter, preFilteredRows, id,
    },
}) => {
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <select
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">Tous</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default SelectFilter;

SelectFilter.propTypes = {
    column: PropTypes.objectOf(Object).isRequired,
};
