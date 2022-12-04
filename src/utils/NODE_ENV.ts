import {NODE_ENV_TYPE} from '../types/NODE_ENV';

// @ts-ignore
export const NODE_ENV: NODE_ENV_TYPE = process.env.NODE_ENV || 'development';
