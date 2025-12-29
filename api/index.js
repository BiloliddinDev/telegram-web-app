// This file is for Vercel Serverless Functions
// For production, we recommend deploying backend separately (Railway, Render, etc.)
// and use rewrites in vercel.json to proxy API requests

module.exports = (req, res) => {
  res.status(501).json({ 
    error: "Backend should be deployed separately. Please use Railway, Render, or Heroku for backend deployment.",
    message: "See VERCEL_DEPLOY.md for instructions"
  });
};

