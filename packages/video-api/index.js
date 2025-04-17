import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

app.post('/generate-video', async (req, res) => {
  const { prompt } = req.body;
  const python = spawn('python3', ['path/to/Wan2.1/generate.py', '--prompt', prompt]);
  let output = '';
  python.stdout.on('data', data => (output += data));
  python.on('close', code => {
    if (code !== 0) return res.status(500).send('Generation failed');
    res.json({ videoUrl: `http://yourcdn.com/${output.trim()}` });
  });
});

app.listen(4000, () => console.log('Video API listening on port 4000')); 