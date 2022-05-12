// load .env
import './config';
import initializeClusters from './cluster';

initializeClusters(() => import('./server'));
