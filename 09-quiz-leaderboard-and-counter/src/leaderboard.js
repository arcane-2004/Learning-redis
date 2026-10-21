import express from 'express'
import Redis from 'ioredis'

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/leaderboard/score', async (req, res) => {

    const {userId, points} = req.body;

    if(!Number.isInteger(Number(points))){
        return res.status(400).json({message: 'invalid input'});
    }

    try{
        const response = await redis.zincrby('leaderboard', points, userId);
        return res.status(200).json({response: Number(response)})
    }catch(err){
        console.log(JSON.stringify(err));
        return res.status(500).json({message: 'internal server error'})
    }
})

app.get('/leaderboard', async(req, res) => {

    try{
        const data = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

        const leaderboard = []
        for(let i=0; i<data.length; i+=2){
            leaderboard.push(
                {
                    userId: data[i],
                    score: Number(data[i+1])
                }
            )
        }

        return res.status(200).json({message: 'Top 10 players',
            leaderboard: leaderboard
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({message: 'internal server error'})
    }
})

app.get('/leaderboard/:userId/rank', async(req, res) => {

    const {userId} = req.params

    try{
        const result = await redis.zrevrank('leaderboard', userId)

        if (result === null) {
            return res.status(404).json({
                message: 'User not found in leaderboard'
            });
        }

        const rank = {
            userId: userId,
            rank: result+1
        }

        return res.status(200).json({
            message: 'RANK',
            rank
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({message: "internal server error"})
    }
})

app.listen(3000, () => {
    console.log('server is running on port http://localhost:3000');
})