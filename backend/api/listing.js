import dbConnect from '../utils/dbConnect';
import Listing from '../models/Listing';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://lost-and-found-lovat.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

router.get('/:id', async (req, res) => {
  console.log("Received request for ID:", req.params.id);
  try {
      const listing = await Listing.findById(req.params.id).populate('createdBy', 'name');
      if (!listing) {
          return res.status(404).json({ message: 'Listing not found' });
      }
      console.log("Fetched listing:", listing);
      res.status(200).json(listing);
  } catch (error) {
      console.error("Error fetching listing:", error); 
      res.status(500).json({ message: 'Failed to fetch listing', error });
  }
});

router.use(async (req, res, next) => {
  await runMiddleware(req, res, cors);

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', 'https://lost-and-found-lovat.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    console.log("Connecting to the database...");
    await dbConnect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Database connection error" });
  }

  next();
});

module.exports = router;
