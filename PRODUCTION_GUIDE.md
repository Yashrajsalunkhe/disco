# Production Configuration Guidelines

## Environment Variables for Production

### Required Environment Variables
```bash
# MongoDB (Use MongoDB Atlas for production)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/discovery_adcet?retryWrites=true&w=majority
MONGOOSE_DEBUG=false

# Email Configuration (Gmail with App Password)
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Razorpay Live Keys (Replace test keys)
RAZORPAY_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend Razorpay Key (Must match RAZORPAY_KEY_ID)
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_id
```

## Security Checklist for Production

### 1. SSL/HTTPS Configuration
- [ ] Obtain SSL certificate (Let's Encrypt recommended)
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Redirect HTTP to HTTPS
- [ ] Update CORS origins to HTTPS domains

### 2. Database Security
- [ ] Use MongoDB Atlas or secure self-hosted MongoDB
- [ ] Enable authentication and authorization
- [ ] Use connection string with credentials
- [ ] Enable encryption at rest

### 3. API Security
- [ ] Rate limiting (implement express-rate-limit)
- [ ] Input validation and sanitization
- [ ] Security headers (helmet.js)
- [ ] API versioning

### 4. Error Handling
- [ ] Hide sensitive error details from users
- [ ] Implement proper logging (Winston/Bunyan)
- [ ] Set up error monitoring (Sentry)
- [ ] Log security events

### 5. Performance
- [ ] Enable compression (express-compression)
- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] CDN for static assets

## Recommended Production Dependencies

```bash
# Security
npm install helmet express-rate-limit express-validator

# Monitoring & Logging
npm install winston morgan

# Performance
npm install compression

# Process Management
npm install pm2 -g
```

## PM2 Production Configuration

```json
{
  "apps": [{
    "name": "discovery-adcet-backend",
    "script": "./dist/index.js",
    "cwd": "./backend",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production",
      "PORT": 3000
    },
    "error_file": "./logs/err.log",
    "out_file": "./logs/out.log",
    "log_file": "./logs/combined.log"
  }]
}
```

## Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deployment Steps

1. **Prepare Environment**
   ```bash
   # Install Node.js, npm, MongoDB (if self-hosting)
   # Install PM2 globally
   npm install -g pm2
   ```

2. **Build Application**
   ```bash
   # Backend
   cd backend && npm install && npm run build
   
   # Frontend
   cd .. && npm install && npm run build
   ```

3. **Configure Environment**
   ```bash
   # Copy production .env
   cp .env.production .env
   ```

4. **Start Services**
   ```bash
   # Start backend with PM2
   pm2 start ecosystem.config.js
   
   # Configure Nginx/Apache for frontend
   # Set up SSL certificates
   ```

5. **Monitor & Maintain**
   ```bash
   # Monitor logs
   pm2 logs
   
   # Monitor processes
   pm2 monit
   
   # Auto-restart on reboot
   pm2 startup
   pm2 save
   ```

## Testing Production Setup

1. Test all API endpoints with HTTPS
2. Verify payment flow with live Razorpay keys
3. Test email notifications
4. Load testing
5. Security scanning