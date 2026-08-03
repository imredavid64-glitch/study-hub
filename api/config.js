module.exports = async function configEndpoint(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    provider: 'study-hub',
    ai: { proxy: '/api/groq', configured: !!process.env.GROQ_API_KEY },
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
      configured: !!(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID)
    },
    supabase: { url: 'https://nnrdkdisjfudibvrggxb.supabase.co', configured: !!process.env.SUPABASE_URL }
  });
};
