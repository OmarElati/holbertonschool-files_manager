import express from 'express';
import router from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000;

router(app);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
