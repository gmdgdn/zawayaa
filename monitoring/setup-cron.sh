#!/bin/bash

# WordPress Migration Monitoring Cron Jobs
# Add these to your crontab with: crontab -e

# Health check every 5 minutes
*/5 * * * * cd /path/to/your/project && npm run monitor:health >> logs/cron-health.log 2>&1

# Performance check every 15 minutes
*/15 * * * * cd /path/to/your/project && npm run monitor:performance >> logs/cron-performance.log 2>&1

# Full dashboard every hour
0 * * * * cd /path/to/your/project && npm run monitor:dashboard >> logs/cron-dashboard.log 2>&1

# Clean old logs daily
0 2 * * * find /path/to/your/project/logs -name "*.log" -mtime +7 -delete
0 2 * * * find /path/to/your/project/logs -name "*.json" -mtime +30 -delete