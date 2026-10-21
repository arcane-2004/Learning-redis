import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function postKey(id) {
    return `post:${id}:views`
}

app.post('/post/:id/view', async (req, res) => {

    const { id } = req.params;

    if (Number.isInteger(Number(id)) && Number(id) > 0) {

        try {
            const count = await redis.incr(postKey(id));
            return res.status(200).json({ postId: id, count: count });
        } catch (err) {
            console.error(JSON.stringify('error', err))
            return res.status(500).json({
                message: 'internal server error',
            })
        }
    }

    return res.status(400).json({ message: 'Invalid Id' })

})

app.listen(3000, () => {
    console.log('server is running on port http://localhost:3000');
})