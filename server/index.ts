import express from 'express';

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
})

.get("/suny", (req, res) => {
  res.send("The best accident of my life");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});