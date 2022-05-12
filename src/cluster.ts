import cluster from 'cluster';
import { cpus } from 'os';
import logger from './utils/logger';

const clusterSize = process.env.MAX_CLUSTERS === 'auto' ? cpus().length : parseInt(process.env.MAX_CLUSTERS!) || 1;
const NAMESPACE = 'Cluster';

export default function initializeClusters(cb: () => unknown) {
    if (cluster.isPrimary) {
        for (let i = 0; i < clusterSize; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code) => {
            logger.log(NAMESPACE, `[PID: ${worker.process.pid}] Worker ${worker.id} died with code ${code}`);
            cluster.fork();
        });
    } else {
        logger.log(NAMESPACE, `Worker started on pid ${process.pid}`);
        cb();
    }
}