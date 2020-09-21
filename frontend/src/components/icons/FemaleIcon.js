import React from 'react';
import theme from 'theme';

/**
 * Speak icon
 *
 * @param {string} width
 * @param {string} color
 */
export const FemaleIcon = ({ width, color }) => {
    const DEFAULT_WIDTH = '25';
    const DEFAULT_COLOR = theme.colors.text.secondary;

    return (
        <svg
            viewBox="0 0 61.132 61.132"
            width={width || DEFAULT_WIDTH}
            fill={theme.colors[color] || DEFAULT_COLOR}
        >
            <path d="M27.482,34.031v12.317h-6.92c-1.703,0-3.084,1.381-3.084,3.084s1.381,3.084,3.084,3.084h6.92v5.531
	c0,1.703,1.381,3.084,3.084,3.084s3.084-1.381,3.084-3.084v-5.531h6.92c1.703,0,3.084-1.381,3.084-3.084s-1.381-3.084-3.084-3.084
	h-6.92V34.031c7.993-1.458,14.072-8.467,14.072-16.874C47.723,7.697,40.026,0,30.566,0c-9.46,0-17.157,7.697-17.157,17.157
	C13.409,25.564,19.489,32.573,27.482,34.031z M30.566,6.169c6.059,0,10.988,4.929,10.988,10.988s-4.929,10.988-10.988,10.988
	s-10.988-4.929-10.988-10.988S24.507,6.169,30.566,6.169z"/>
        </svg>
    );
};
