/* eslint-disable react/prop-types */
import React from 'react';
import {
    TableBody, TableRow, TableCell, makeStyles, createStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => createStyles({
    interestsBubble: {
        backgroundColor: theme.colorPalette.interestsBubble,
        padding: '1px 8px',
        color: theme.colorPalette.blueCorner,
        borderRadius: '12px',
        '&:not(:last-child)': {
            marginRight: '4px',
        },
    },
}));

function TableBodyComponent({ columnsTitle, adherents }) {
    const { items } = adherents;
    const classes = useStyles();

    return (
        <TableBody>
            {items && items.map((adherent, index) => (
                <TableRow key={index} hover>
                    {columnsTitle.map((column, i) => {
                        let value = adherent[column.key];

                        if (column.type === 'trans' || column.type === 'array|trans') {
                            if (Array.isArray(value)) {
                                value = value.map((el, ind) => column.messages[el] !== undefined && <span key={ind} className={classes.interestsBubble}>{column.messages[el]}</span>);
                            } else {
                                value = column.messages[value];
                            }
                        }

                        if (column.type === 'boolean') {
                            if (value) {
                                value = <CheckIcon style={{ color: 'green' }} />;
                            } else {
                                value = <ClearIcon style={{ color: 'red' }} />;
                            }
                        }

                        return (
                            <TableCell key={`${index}-${i}`}>{value}</TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
}

export default TableBodyComponent;
