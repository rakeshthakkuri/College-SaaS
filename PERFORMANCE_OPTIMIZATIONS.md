# Performance Optimizations

This document outlines the performance optimizations implemented to reduce latency.

## Optimizations Applied

### 1. Database Query Optimization (N+1 Problem Fixed)

**Before:** Making individual queries for each item
```javascript
// BAD: N+1 queries
assessments.map(async (assessment) => {
  const { count } = await supabase.from('Question').select('*', { count: 'exact' }).eq('assessmentId', assessment.id);
  // ... more queries
});
```

**After:** Batch queries using `.in()` operator
```javascript
// GOOD: 2 queries total
const { data: questionData } = await supabase
  .from('Question')
  .select('assessmentId')
  .in('assessmentId', assessmentIds);
```

**Impact:** Reduces database queries from O(n) to O(1) for counts

### 2. Response Compression

- Added `compression` middleware to gzip all responses
- Reduces payload size by 60-80%
- Faster data transfer over the network

### 3. HTTP Caching

- Public endpoints (colleges list) cached for 5 minutes
- Health check endpoint cached for 1 minute
- Reduces database load for frequently accessed data

### 4. Fly.io Configuration

- **Region:** Changed to `iad` (US East) for better global latency
- **Memory:** Increased from 256MB to 512MB
- **Auto-stop:** Disabled to prevent cold starts
- **Min machines:** Set to 1 to keep server warm

### 5. Frontend Build Optimization

- Optimized chunk splitting for better caching
- CSS code splitting enabled
- Asset inlining threshold optimized
- Better cache headers for static assets

### 6. Supabase Client Optimization

- Optimized client configuration
- Disabled unnecessary session persistence
- Better connection handling

## Expected Performance Improvements

- **Database queries:** 10-100x faster (depending on data size)
- **Response size:** 60-80% smaller (with compression)
- **Cold starts:** Eliminated (machines stay running)
- **Cache hits:** Faster responses for public data

## Monitoring Performance

### Check Response Times

```bash
# Test backend health
time curl https://your-backend.fly.dev/api/health

# Test with compression
curl -H "Accept-Encoding: gzip" -v https://your-backend.fly.dev/api/health
```

### Check Database Query Performance

Monitor Supabase dashboard:
- Go to Database → Query Performance
- Check slow queries
- Verify indexes are being used

## Additional Recommendations

### 1. Database Indexes

Ensure these indexes exist (already in schema):
- `Student_email_idx`
- `Student_collegeId_idx`
- `Assessment_collegeId_idx`
- `Question_assessmentId_idx`
- `AssessmentAttempt_studentId_idx`

### 2. Consider Adding

- **Redis caching** for frequently accessed data
- **CDN** for static assets (Render already provides this)
- **Database connection pooling** (Supabase handles this)
- **Rate limiting** to prevent abuse

### 3. Region Selection

Choose Fly.io region closest to your users:
- `iad` - US East (default)
- `lhr` - London
- `bom` - Mumbai
- `sin` - Singapore

Update in `fly.toml`:
```toml
primary_region = 'iad'  # Change to your preferred region
```

## Cost vs Performance

Current configuration:
- **Memory:** 512MB (free tier: 256MB)
- **CPU:** 1 shared CPU (free tier)
- **Machines:** 1 always running (prevents cold starts)

To reduce costs while maintaining performance:
- Use `auto_stop_machines = 'stop'` (will have cold starts)
- Reduce `min_machines_running = 0` (will scale to zero)

## Troubleshooting Slow Queries

1. Check Supabase query logs
2. Verify indexes are being used
3. Check network latency between services
4. Monitor Fly.io metrics
5. Check if database is in same region

