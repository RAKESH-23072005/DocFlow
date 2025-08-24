# Rollback Plan

This document outlines the rollback procedures for the Image Compressor application in case of deployment issues or critical bugs discovered in production.

## 🚨 Emergency Rollback Triggers

### Immediate Rollback Required
- **Critical Security Vulnerabilities**: Any security issues that could compromise user data
- **Application Crashes**: Service completely unavailable or throwing 500 errors
- **Database Corruption**: Data integrity issues or connection failures
- **Performance Degradation**: Response times > 10 seconds or 90%+ error rates
- **User Data Loss**: Any scenario where user data is corrupted or lost

### Consider Rollback
- **Feature Bugs**: Non-critical functionality not working as expected
- **Performance Issues**: Response times 2-5 seconds or 10-50% error rates
- **UI/UX Problems**: Interface issues that don't affect core functionality
- **Monitoring Alerts**: Multiple warning thresholds exceeded

## 🔄 Rollback Procedures

### Quick Rollback (5-10 minutes)

#### 1. Stop Current Deployment
```bash
# If using PM2
pm2 stop imagecompressor

# If using Docker
docker stop imagecompressor-container

# If using systemd
sudo systemctl stop imagecompressor

# If using direct Node.js
pkill -f "node dist/index.js"
```

#### 2. Restore Previous Version
```bash
# Navigate to application directory
cd /var/www/imagecompressor

# Check current version
git log --oneline -5

# Rollback to previous commit
git checkout HEAD~1

# Install dependencies (if needed)
npm ci --only=production

# Rebuild application
npm run build:prod

# Verify build
npm run verify:build
```

#### 3. Restart Application
```bash
# Start with PM2
pm2 start imagecompressor

# Start with Docker
docker start imagecompressor-container

# Start with systemd
sudo systemctl start imagecompressor

# Start directly
npm start
```

#### 4. Verify Rollback
```bash
# Health check
curl https://yourdomain.com/api/health

# Basic functionality test
curl https://yourdomain.com/

# Check logs for errors
tail -f /var/log/imagecompressor/app.log
```

### Database Rollback (if needed)

#### 1. Stop Application
```bash
pm2 stop imagecompressor
```

#### 2. Database Rollback
```bash
# If using Drizzle migrations
npm run db:push --force

# If using manual SQL
psql -d your_database -f backup/rollback.sql

# If using MongoDB
mongorestore --db your_database backup/rollback/
```

#### 3. Restart Application
```bash
pm2 start imagecompressor
```

### Infrastructure Rollback

#### 1. Load Balancer
```bash
# Remove new instance from load balancer
aws elbv2 deregister-targets \
  --target-group-arn your-target-group \
  --targets Id=i-new-instance-id

# Add previous instance back
aws elbv2 register-targets \
  --target-group-arn your-target-group \
  --targets Id=i-previous-instance-id
```

#### 2. DNS Rollback
```bash
# Update DNS to point to previous server
aws route53 change-resource-record-sets \
  --hosted-zone-id your-zone-id \
  --change-batch file://rollback-dns.json
```

## 📋 Rollback Checklist

### Pre-Rollback
- [ ] **Assess Impact**: Determine scope of affected users/features
- [ ] **Notify Team**: Alert development and operations teams
- [ ] **Document Issue**: Record what went wrong and when
- [ ] **Backup Current State**: Save current logs and error messages
- [ ] **Prepare Rollback**: Ensure previous version is accessible

### During Rollback
- [ ] **Stop Services**: Gracefully shut down current deployment
- [ ] **Verify Backup**: Confirm previous version is intact
- [ ] **Execute Rollback**: Follow rollback procedure step by step
- [ ] **Test Functionality**: Verify core features work correctly
- [ ] **Monitor Health**: Check application and database health

### Post-Rollback
- [ ] **Verify Rollback**: Confirm all services are running correctly
- [ ] **Monitor Performance**: Watch for any new issues
- [ ] **Update Stakeholders**: Inform users and team of resolution
- [ ] **Investigate Root Cause**: Analyze what caused the deployment issue
- [ ] **Document Lessons**: Update rollback procedures if needed

## 🛠️ Rollback Tools & Scripts

### Automated Rollback Script
```bash
#!/bin/bash
# rollback.sh - Automated rollback script

set -e

echo "🚨 Starting emergency rollback..."

# Configuration
APP_DIR="/var/www/imagecompressor"
BACKUP_DIR="/var/backups/imagecompressor"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup of current state
echo "📦 Creating backup of current state..."
mkdir -p "$BACKUP_DIR"
cp -r "$APP_DIR" "$BACKUP_DIR/backup_$TIMESTAMP"

# Stop application
echo "⏹️ Stopping application..."
pm2 stop imagecompressor || true

# Rollback to previous version
echo "🔄 Rolling back to previous version..."
cd "$APP_DIR"
git checkout HEAD~1

# Install dependencies and rebuild
echo "🔧 Rebuilding application..."
npm ci --only=production
npm run build:prod
npm run verify:build

# Start application
echo "▶️ Starting application..."
pm2 start imagecompressor

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 10

# Verify rollback
echo "✅ Verifying rollback..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "🎉 Rollback successful!"
    exit 0
else
    echo "❌ Rollback failed - application not responding"
    exit 1
fi
```

### Health Check Script
```bash
#!/bin/bash
# health-check.sh - Health check script

HEALTH_URL="http://localhost:3000/api/health"
MAX_RETRIES=5
RETRY_DELAY=2

for i in $(seq 1 $MAX_RETRIES); do
    if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
        echo "✅ Application is healthy"
        exit 0
    fi
    
    echo "❌ Health check failed (attempt $i/$MAX_RETRIES)"
    
    if [ $i -lt $MAX_RETRIES ]; then
        sleep $RETRY_DELAY
    fi
done

echo "💥 Application health check failed after $MAX_RETRIES attempts"
exit 1
```

## 📊 Rollback Metrics

### Track These Metrics
- **Rollback Time**: Time from issue detection to resolution
- **Downtime Duration**: Total time service was unavailable
- **User Impact**: Number of affected users
- **Data Loss**: Any data that couldn't be recovered
- **Root Cause**: What caused the deployment issue

### Rollback Success Criteria
- **Application Health**: All health checks passing
- **Core Functionality**: Image compression working correctly
- **Performance**: Response times < 2 seconds
- **Error Rate**: < 1% error rate
- **Database**: All connections stable

## 🚨 Emergency Contacts

### Primary Contacts
- **DevOps Lead**: devops@yourdomain.com / +1-XXX-XXX-XXXX
- **Tech Lead**: tech@yourdomain.com / +1-XXX-XXX-XXXX
- **Product Manager**: product@yourdomain.com / +1-XXX-XXX-XXXX

### Escalation Path
1. **Level 1**: DevOps Engineer (immediate response)
2. **Level 2**: Tech Lead (within 30 minutes)
3. **Level 3**: Product Manager (within 1 hour)
4. **Level 4**: CTO/VP Engineering (within 2 hours)

## 📚 Rollback Documentation

### Required Documentation
- **Incident Report**: What happened, when, and why
- **Rollback Log**: Step-by-step actions taken
- **Root Cause Analysis**: Why the deployment failed
- **Prevention Measures**: How to avoid similar issues
- **Procedure Updates**: Any changes to rollback process

### Post-Incident Review
- **Timeline Review**: Analyze response and resolution times
- **Process Improvement**: Identify areas for optimization
- **Training Needs**: Determine if additional training is required
- **Tool Evaluation**: Assess if current tools are adequate

## 🔄 Rollback Testing

### Regular Rollback Drills
- **Monthly**: Test rollback procedures in staging environment
- **Quarterly**: Full disaster recovery simulation
- **Annually**: Comprehensive rollback and recovery testing

### Test Scenarios
- **Application Rollback**: Deploy broken version, test rollback
- **Database Rollback**: Corrupt test data, test recovery
- **Infrastructure Rollback**: Simulate server failure, test failover
- **Full System Rollback**: Complete system failure and recovery

---

**Last Updated**: December 22, 2024  
**Version**: 1.1.0  
**Next Review**: March 22, 2025  
**Approved By**: DevOps Team
