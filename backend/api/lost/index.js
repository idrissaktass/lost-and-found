// api/lost/index.js
import express from 'express';
import getLost from './get';
// You can import additional route files here (e.g., create, update, delete)

const router = express.Router();

// Use the imported getLost route
router.use('/get', getLost);  // Mount the get route at /api/lost/get

// You can add other route usages here, e.g.,
// router.use('/create', createLost);
// router.use('/update', updateLost);
// router.use('/delete', deleteLost);

export default router;
