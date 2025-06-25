import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/api/account', (req, res) => {
    res.status(200).json({
        message: "Account created successfully",
        data: req.body
    });console.log("Received request to create account:", JSON.stringify(req.body));
    
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})