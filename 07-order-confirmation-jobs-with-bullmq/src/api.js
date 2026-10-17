import express from 'express'
import { emailQueue } from './queue'
import Redis from 'ioredis'

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/welcome-email', (req, res) => {
    const job = emailQueue.add(
        "send-welcome-email",
        {
            to: req.body.to,
            name: req.body.name
        },
        {
            attempts: 3,
            backoffs: {
                type: 'exponential',
                delay: 1000
            },
        }
    );
    res.json({
        message: "welcome email job added to queue",
        jobId: job.id
    }); 
})

app.listen(3000, () => {
    console.log("server running on port http://localhost:3000")
})