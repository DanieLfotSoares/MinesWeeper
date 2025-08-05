// src/components/Cell.js
import React from 'react';
import './Cell.css';

const Cell = ({ cell, onClick, onRightClick, cellSize }) => {
    let content = '';
    if (cell.flagged === 'flag') {
        content = '';  // Emoji será adicionado via CSS
    } else if (cell.flagged === 'question') {
        content = '';  // Emoji será adicionado via CSS
    } else if (cell.open) {
        if (cell.bomb) {
            content = '';  // Emoji será adicionado via CSS
        } else {
            const bombsAround = cell.bombsAround;
            content = bombsAround > 0 ? bombsAround : '';
        }
    }

    let cellClass = 'cell';
    if (cell.open) {
        cellClass += ' open';
        if (cell.bomb) {
            cellClass += ' bomb';
        }
    } else if (cell.flagged === 'flag') {
        cellClass += ' flag';
    } else if (cell.flagged === 'question') {
        cellClass += ' question';
    }

    return (
        <div
            className={cellClass}
            onClick={onClick}
            onContextMenu={onRightClick}
            style={{ 
                width: cellSize, 
                height: cellSize, 
                fontSize: Math.max(12, cellSize * 0.6)
            }}
            data-bombs={cell.open && !cell.bomb ? cell.bombsAround : undefined}
        >
            {content}
        </div>
    );
};

export default Cell;
