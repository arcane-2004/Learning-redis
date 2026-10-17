import { Worker } from 'bullmq'
import { connection } from './queue'

const worker = new Worker(
    "emails",
    async (job) => {
        console.log("Processing email jobs...", job.id, job.name, job.data);
        (await new Promise((resolve) => setTimeout(() => {
            resolve
        }, 1500)),
            console.log("Email processing completed!", job.id, job.name, job.data));
    },
    {connection}
);

worker.on('completed', (job) => {
    console.log('Job completed!', job.id, job.name, job.data);
});

worker.on('failed', (job) => {
    console.log('Job failed!', job.id, job.name, job.data);
});