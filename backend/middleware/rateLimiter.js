const rateLimits = new Map();

export const rateLimiter = (limit = 10, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimits.has(ip)) {
      rateLimits.set(ip, []);
    }

    let requests = rateLimits.get(ip);
    // Filter out requests outside the time window
    requests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (requests.length >= limit) {
      return res.status(429).json({
        message: 'Too many requests from this IP. Please try again later.'
      });
    }

    requests.push(now);
    rateLimits.set(ip, requests);
    next();
  };
};
