import React from 'react';
import theme from 'theme';

/**
 * Speak icon
 *
 * @param {string} width
 * @param {string} color
 */
export const MaleIcon = ({ width, color }) => {
    const DEFAULT_WIDTH = '25';
    const DEFAULT_COLOR = theme.colors.text.secondary;

    return (
        // <svg
        //     // enable-background="new 0 0 24 24"
        //     // height="30"
        //     viewBox="0 0 24 24"
        //     width={width || DEFAULT_WIDTH}
        //     xmlns="http://www.w3.org/2000/svg"
        //     fill={theme.colors[color] || DEFAULT_COLOR}
        // >
        <svg
            viewBox="0 0 49.267 49.267">
            <path d="M31.261,22.368l11.838-11.838v12.602c0,0.851,0.345,1.623,0.903,2.181s1.33,0.904,2.181,0.903
	c1.704,0,3.085-1.381,3.085-3.085V3.084C49.268,1.382,47.886-0.001,46.183,0L26.135,0c-1.704,0-3.085,1.381-3.085,3.085
	c-0.001,1.702,1.382,3.085,3.084,3.084h12.602L26.899,18.006c-6.682-4.621-15.938-3.964-21.882,1.981
	c-6.689,6.689-6.689,17.574,0,24.263s17.574,6.689,24.263,0C35.225,38.306,35.882,29.05,31.261,22.368z M9.379,39.888
	c-4.284-4.284-4.284-11.255,0-15.54s11.255-4.284,15.54,0s4.284,11.255,0,15.54S13.663,44.173,9.379,39.888z"/>
        </svg>

    );
};
