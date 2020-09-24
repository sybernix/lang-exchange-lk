import React from 'react';
import theme from 'theme';

/**
 * Speak icon
 *
 * @param {string} width
 * @param {string} color
 */
export const LocationIcon = ({ width, color }) => {
    const DEFAULT_WIDTH = '25';
    const DEFAULT_COLOR = theme.colors.text.secondary;

    return (
        <svg 
        width={width || DEFAULT_WIDTH}
        fill={theme.colors[color] || DEFAULT_COLOR}
        viewBox="0 0 368.16 368.16" 
        >
            <g>
                <g>
                    <g>
                        <path d="M184.08,0c-74.992,0-136,61.008-136,136c0,24.688,11.072,51.24,11.536,52.36c3.576,8.488,10.632,21.672,15.72,29.4
				l93.248,141.288c3.816,5.792,9.464,9.112,15.496,9.112s11.68-3.32,15.496-9.104l93.256-141.296
				c5.096-7.728,12.144-20.912,15.72-29.4c0.464-1.112,11.528-27.664,11.528-52.36C320.08,61.008,259.072,0,184.08,0z
				 M293.8,182.152c-3.192,7.608-9.76,19.872-14.328,26.8l-93.256,141.296c-1.84,2.792-2.424,2.792-4.264,0L88.696,208.952
				c-4.568-6.928-11.136-19.2-14.328-26.808C74.232,181.816,64.08,157.376,64.08,136c0-66.168,53.832-120,120-120
				c66.168,0,120,53.832,120,120C304.08,157.408,293.904,181.912,293.8,182.152z"/>
                        <path d="M184.08,64.008c-39.704,0-72,32.304-72,72c0,39.696,32.296,72,72,72c39.704,0,72-32.304,72-72
				C256.08,96.312,223.784,64.008,184.08,64.008z M184.08,192.008c-30.872,0-56-25.12-56-56s25.128-56,56-56s56,25.12,56,56
				S214.952,192.008,184.08,192.008z"/>
                    </g>
                </g>
            </g>
        </svg>

    );
};