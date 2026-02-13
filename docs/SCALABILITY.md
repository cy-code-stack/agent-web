# Scalability Documentation

## Table of Contents

1. [Overview](#1-overview)
2. [Capacity Planning](#2-capacity-planning)
3. [Infrastructure Topology](#3-infrastructure-topology)
4. [Caching Strategy](#4-caching-strategy)
5. [Database Scaling](#5-database-scaling)
6. [Performance Optimization](#6-performance-optimization)
7. [Monitoring and Alerting](#7-monitoring-and-alerting)

---

## 1. Overview

### Scalability Goals

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Concurrent Users** | 10,000 | Business requirement |
| **Requests per Second** | 1,000 RPS | 10K users × 5-6 req/min peak |
| **Response Time (p50)** | < 100ms | Good user experience |
| **Response Time (p99)** | < 500ms | Acceptable worst case |
| **Availability** | 99.9% | ~8.76 hours downtime/year |

### Scalability Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SCALABILITY PRINCIPLES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. STATELESS APPLICATION                                                    │
│     ├── No session state in memory                                          │
│     ├── JWT tokens for authentication                                       │
│     └── Redis for shared state                                              │
│                                                                              │
│  2. HORIZONTAL SCALING                                                       │
│     ├── Add more instances, not bigger instances                            │
│     ├── Load balancer distributes traffic                                   │
│     └── Auto-scaling based on metrics                                       │
│                                                                              │
│  3. CACHE AGGRESSIVELY                                                       │
│     ├── 80%+ cache hit rate target                                          │
│     ├── Cache-aside pattern                                                 │
│     └── Smart invalidation                                                  │
│                                                                              │
│  4. DATABASE OPTIMIZATION                                                    │
│     ├── Read replicas for scaling reads                                     │
│     ├── Connection pooling                                                  │
│     └── Query optimization                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Capacity Planning

### 2.1 Traffic Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRAFFIC ESTIMATION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Behavior Assumptions:                                                  │
│  ├── Active session duration: 30 minutes                                    │
│  ├── Requests per user per minute: 3-5 (average 4)                         │
│  ├── Peak multiplier: 2x average                                            │
│  └── Concurrent users during peak: 10,000                                   │
│                                                                              │
│  Traffic Calculations:                                                       │
│  ├── Average RPS: 10,000 × 4 / 60 = 667 RPS                                │
│  ├── Peak RPS: 667 × 2 = 1,334 RPS                                         │
│  └── Design capacity: 1,500 RPS (headroom)                                 │
│                                                                              │
│  Request Distribution:                                                       │
│  ├── Read requests: 85%                                                     │
│  ├── Write requests: 15%                                                    │
│  └── Cached responses: 70%                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Resource Requirements

#### API Servers (Go)

| Resource | Per Instance | 3 Instances | Notes |
|----------|--------------|-------------|-------|
| CPU | 4 cores | 12 cores | Go handles ~400-500 RPS/instance |
| Memory | 8 GB | 24 GB | Low memory footprint |
| Network | 1 Gbps | 3 Gbps | Shared bandwidth |

#### Redis Cluster

| Resource | Per Node | 3 Nodes | Notes |
|----------|----------|---------|-------|
| CPU | 2 cores | 6 cores | Mostly I/O bound |
| Memory | 4 GB | 12 GB | Cache + sessions |
| Network | 1 Gbps | 3 Gbps | High throughput |

#### MySQL

| Resource | Primary | Replicas (2) | Notes |
|----------|---------|--------------|-------|
| CPU | 8 cores | 4 cores each | Write-heavy primary |
| Memory | 32 GB | 16 GB each | Buffer pool |
| Storage | 500 GB SSD | 500 GB SSD | NVMe recommended |

---

## 3. Infrastructure Topology

### 3.1 Production Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION INFRASTRUCTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              INTERNET                                        │
│                                  │                                          │
│                                  ▼                                          │
│                     ┌────────────────────────┐                              │
│                     │      CloudFlare        │                              │
│                     │   CDN + WAF + DDoS     │                              │
│                     └───────────┬────────────┘                              │
│                                 │                                           │
│                                 ▼                                           │
│    ┌────────────────────────────────────────────────────────────┐          │
│    │                    LOAD BALANCER (Nginx)                    │          │
│    │                    - SSL Termination                        │          │
│    │                    - Health Checks                          │          │
│    │                    - Round Robin / Least Conn               │          │
│    └────────────────────────┬───────────────────────────────────┘          │
│                             │                                               │
│           ┌─────────────────┼─────────────────┐                            │
│           │                 │                 │                            │
│           ▼                 ▼                 ▼                            │
│    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                     │
│    │  API Node 1 │   │  API Node 2 │   │  API Node 3 │                     │
│    │   (Go App)  │   │   (Go App)  │   │   (Go App)  │                     │
│    │  4C / 8GB   │   │  4C / 8GB   │   │  4C / 8GB   │                     │
│    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘                     │
│           │                 │                 │                            │
│           └─────────────────┼─────────────────┘                            │
│                             │                                               │
│    ┌────────────────────────┴────────────────────────┐                     │
│    │                                                  │                     │
│    ▼                                                  ▼                     │
│ ┌─────────────────────────┐          ┌─────────────────────────────────┐   │
│ │     REDIS CLUSTER       │          │         MYSQL CLUSTER           │   │
│ │  ┌───────┐ ┌───────┐   │          │                                 │   │
│ │  │Primary│ │Replica│   │          │  ┌─────────┐    ┌─────────┐    │   │
│ │  │ Node  │ │ Node  │   │          │  │ Primary │───►│Replica 1│    │   │
│ │  └───────┘ └───────┘   │          │  │  (R/W)  │    │  (Read) │    │   │
│ │       ┌───────┐        │          │  └────┬────┘    └─────────┘    │   │
│ │       │Replica│        │          │       │                         │   │
│ │       │ Node  │        │          │       │         ┌─────────┐    │   │
│ │       └───────┘        │          │       └────────►│Replica 2│    │   │
│ │   4GB × 3 = 12GB       │          │                 │  (Read) │    │   │
│ └─────────────────────────┘          │                 └─────────┘    │   │
│                                      └─────────────────────────────────┘   │
│                                                                              │
│    ┌─────────────────────────────────────────────────────────────┐          │
│    │                    OBJECT STORAGE (S3)                       │          │
│    │              - File uploads                                  │          │
│    │              - Document storage                              │          │
│    │              - Backup storage                                │          │
│    └─────────────────────────────────────────────────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Load Balancer Configuration

```nginx
# /etc/nginx/nginx.conf

upstream api_backend {
    least_conn;  # Use least connections algorithm

    server api-node-1:8080 weight=1 max_fails=3 fail_timeout=30s;
    server api-node-2:8080 weight=1 max_fails=3 fail_timeout=30s;
    server api-node-3:8080 weight=1 max_fails=3 fail_timeout=30s;

    keepalive 32;  # Connection pooling
}

server {
    listen 443 ssl http2;
    server_name api.agentinterface.example.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/api.crt;
    ssl_certificate_key /etc/ssl/private/api.key;
    ssl_protocols TLSv1.3;

    # Proxy settings
    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Health check endpoint (no auth)
    location /health {
        proxy_pass http://api_backend;
        access_log off;
    }
}
```

### 3.3 Auto-Scaling Rules

```yaml
# Kubernetes HPA or AWS Auto Scaling equivalent

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
```

---

## 4. Caching Strategy

### 4.1 Cache Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYERS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Layer 1: CDN Cache (Static Assets)                                          │
│  ├── Images, CSS, JS                                                        │
│  ├── TTL: 1 year (versioned)                                                │
│  └── Hit rate: 95%+                                                         │
│                                                                              │
│  Layer 2: Application Cache (In-Memory)                                      │
│  ├── Hot configuration data                                                 │
│  ├── TTL: 5 minutes                                                         │
│  └── Hit rate: 90%+                                                         │
│                                                                              │
│  Layer 3: Distributed Cache (Redis)                                          │
│  ├── API responses                                                          │
│  ├── Session data                                                           │
│  ├── TTL: Varies by data type                                               │
│  └── Hit rate target: 80%+                                                  │
│                                                                              │
│  Layer 4: Database Query Cache                                               │
│  ├── Complex aggregations                                                   │
│  ├── Dashboard statistics                                                   │
│  └── Refreshed on schedule                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Redis Cache Keys and TTL

| Key Pattern | TTL | Description | Invalidation |
|-------------|-----|-------------|--------------|
| `session:{user_id}` | 15min | JWT session data | On logout |
| `refresh:{token_hash}` | 7d | Refresh token | On logout/refresh |
| `blacklist:{jti}` | 1h | Revoked tokens | Auto-expire |
| `agent:{agent_id}` | 30min | Agent profile | On update |
| `agent:user:{user_id}` | 1h | Agent ID lookup | On update |
| `agent:referral:{code}` | 1h | Referral code lookup | Rarely changes |
| `clients:{agent_id}:list:p{page}` | 10min | Client list page | On add/update |
| `clients:{agent_id}:count` | 10min | Client count | On add/delete |
| `client:{client_id}` | 15min | Client detail | On update |
| `dashboard:{agent_id}` | 5min | Dashboard stats | On any change |
| `sales:{agent_id}:list:p{page}` | 10min | Sales list | On update |
| `incentives:{agent_id}:list` | 10min | Incentive list | On update |
| `projects:list` | 1h | Project catalog | Admin update |
| `project:{id}` | 1h | Project detail | Admin update |
| `units:project:{id}` | 30min | Units list | On reservation |
| `unit:{id}` | 30min | Unit detail | On status change |

### 4.3 Cache-Aside Implementation

```go
// internal/infrastructure/cache/cache_service.go

type CacheService struct {
    redis  *redis.Client
    logger *zap.Logger
}

// GetOrSet implements cache-aside pattern
func (c *CacheService) GetOrSet(
    ctx context.Context,
    key string,
    dest interface{},
    ttl time.Duration,
    fetchFn func() (interface{}, error),
) error {
    // 1. Try to get from cache
    cached, err := c.redis.Get(ctx, key).Result()
    if err == nil {
        // Cache hit
        if err := json.Unmarshal([]byte(cached), dest); err == nil {
            c.logger.Debug("cache hit", zap.String("key", key))
            return nil
        }
    }

    // 2. Cache miss - fetch from source
    c.logger.Debug("cache miss", zap.String("key", key))
    data, err := fetchFn()
    if err != nil {
        return err
    }

    // 3. Store in cache (async to not block response)
    go func() {
        jsonData, err := json.Marshal(data)
        if err != nil {
            c.logger.Error("cache marshal error", zap.Error(err))
            return
        }
        if err := c.redis.Set(context.Background(), key, jsonData, ttl).Err(); err != nil {
            c.logger.Error("cache set error", zap.Error(err))
        }
    }()

    // 4. Copy data to destination
    jsonData, _ := json.Marshal(data)
    return json.Unmarshal(jsonData, dest)
}

// InvalidatePattern deletes all keys matching a pattern
func (c *CacheService) InvalidatePattern(ctx context.Context, pattern string) error {
    iter := c.redis.Scan(ctx, 0, pattern, 100).Iterator()
    for iter.Next(ctx) {
        if err := c.redis.Del(ctx, iter.Val()).Err(); err != nil {
            c.logger.Error("cache delete error",
                zap.String("key", iter.Val()),
                zap.Error(err))
        }
    }
    return iter.Err()
}
```

### 4.4 Cache Invalidation Events

```go
// internal/application/events/cache_invalidation.go

type CacheInvalidator struct {
    cache *CacheService
}

func (ci *CacheInvalidator) OnAgentUpdated(agentID int64, userID int64) {
    ctx := context.Background()
    ci.cache.Delete(ctx, fmt.Sprintf("agent:%d", agentID))
    ci.cache.Delete(ctx, fmt.Sprintf("agent:user:%d", userID))
}

func (ci *CacheInvalidator) OnClientAdded(agentID int64) {
    ctx := context.Background()
    ci.cache.InvalidatePattern(ctx, fmt.Sprintf("clients:%d:*", agentID))
    ci.cache.Delete(ctx, fmt.Sprintf("dashboard:%d", agentID))
}

func (ci *CacheInvalidator) OnClientUpdated(clientID int64, agentIDs []int64) {
    ctx := context.Background()
    ci.cache.Delete(ctx, fmt.Sprintf("client:%d", clientID))
    for _, agentID := range agentIDs {
        ci.cache.InvalidatePattern(ctx, fmt.Sprintf("clients:%d:*", agentID))
    }
}

func (ci *CacheInvalidator) OnSaleCreated(agentID int64, unitID int64, projectID int64) {
    ctx := context.Background()
    ci.cache.InvalidatePattern(ctx, fmt.Sprintf("sales:%d:*", agentID))
    ci.cache.Delete(ctx, fmt.Sprintf("dashboard:%d", agentID))
    ci.cache.Delete(ctx, fmt.Sprintf("unit:%d", unitID))
    ci.cache.InvalidatePattern(ctx, fmt.Sprintf("units:project:%d", projectID))
}
```

---

## 5. Database Scaling

### 5.1 Read/Write Splitting

```go
// internal/infrastructure/persistence/mysql/cluster.go

type DBCluster struct {
    primary  *sql.DB
    replicas []*sql.DB
    rrIndex  uint64 // Round-robin index
    mu       sync.Mutex
}

func NewDBCluster(config DBConfig) (*DBCluster, error) {
    // Initialize primary
    primary, err := sql.Open("mysql", config.PrimaryDSN)
    if err != nil {
        return nil, fmt.Errorf("failed to connect to primary: %w", err)
    }
    configurePrimaryPool(primary)

    // Initialize replicas
    var replicas []*sql.DB
    for i, dsn := range config.ReplicaDSNs {
        replica, err := sql.Open("mysql", dsn)
        if err != nil {
            return nil, fmt.Errorf("failed to connect to replica %d: %w", i, err)
        }
        configureReplicaPool(replica)
        replicas = append(replicas, replica)
    }

    return &DBCluster{
        primary:  primary,
        replicas: replicas,
    }, nil
}

// Primary returns the primary database for writes
func (c *DBCluster) Primary() *sql.DB {
    return c.primary
}

// Replica returns a replica using round-robin
func (c *DBCluster) Replica() *sql.DB {
    if len(c.replicas) == 0 {
        return c.primary // Fallback to primary
    }

    idx := atomic.AddUint64(&c.rrIndex, 1)
    return c.replicas[idx%uint64(len(c.replicas))]
}

func configurePrimaryPool(db *sql.DB) {
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(10)
    db.SetConnMaxLifetime(5 * time.Minute)
    db.SetConnMaxIdleTime(1 * time.Minute)
}

func configureReplicaPool(db *sql.DB) {
    db.SetMaxOpenConns(50) // Higher for reads
    db.SetMaxIdleConns(25)
    db.SetConnMaxLifetime(5 * time.Minute)
    db.SetConnMaxIdleTime(1 * time.Minute)
}
```

### 5.2 Connection Pool Settings

| Setting | Primary | Replica | Rationale |
|---------|---------|---------|-----------|
| MaxOpenConns | 25 | 50 | Writes are fewer but critical |
| MaxIdleConns | 10 | 25 | Keep connections warm |
| ConnMaxLifetime | 5m | 5m | Prevent stale connections |
| ConnMaxIdleTime | 1m | 1m | Release unused connections |

### 5.3 Query Optimization

```sql
-- Ensure proper indexes exist
-- Client list query (most frequent)
EXPLAIN SELECT b.id, b.first_name, b.last_name, b.email, b.contact_number,
               b.buyer_type, b.created_at
FROM re_buyers b
INNER JOIN re_agent_buyers ab ON b.id = ab.buyer_id
WHERE ab.agent_id = 456
  AND b.deleted_at IS NULL
ORDER BY ab.created_at DESC
LIMIT 20 OFFSET 0;

-- Recommended index
CREATE INDEX idx_agent_buyers_agent_created
ON re_agent_buyers (agent_id, created_at DESC);

-- Dashboard statistics query
-- Consider materialized view or scheduled aggregation
CREATE TABLE agent_statistics (
    agent_id BIGINT UNSIGNED PRIMARY KEY,
    total_clients INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    pending_sales INT DEFAULT 0,
    total_incentives DECIMAL(15,2) DEFAULT 0,
    pending_incentives DECIMAL(15,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES re_agents(id)
);

-- Update statistics via trigger or scheduled job
```

---

## 6. Performance Optimization

### 6.1 Go Application Optimizations

```go
// 1. Use connection pooling for external services
var httpClient = &http.Client{
    Transport: &http.Transport{
        MaxIdleConns:        100,
        MaxIdleConnsPerHost: 10,
        IdleConnTimeout:     90 * time.Second,
    },
    Timeout: 30 * time.Second,
}

// 2. Use worker pools for background tasks
type WorkerPool struct {
    jobs    chan func()
    workers int
}

func NewWorkerPool(workers int, queueSize int) *WorkerPool {
    wp := &WorkerPool{
        jobs:    make(chan func(), queueSize),
        workers: workers,
    }
    for i := 0; i < workers; i++ {
        go wp.worker()
    }
    return wp
}

func (wp *WorkerPool) worker() {
    for job := range wp.jobs {
        job()
    }
}

func (wp *WorkerPool) Submit(job func()) {
    wp.jobs <- job
}

// 3. Use sync.Pool for frequently allocated objects
var responsePool = sync.Pool{
    New: func() interface{} {
        return &Response{}
    },
}

func getResponse() *Response {
    return responsePool.Get().(*Response)
}

func putResponse(r *Response) {
    r.Reset()
    responsePool.Put(r)
}

// 4. Efficient JSON serialization
import jsoniter "github.com/json-iterator/go"

var json = jsoniter.ConfigCompatibleWithStandardLibrary
```

### 6.2 Response Compression

```go
// internal/infrastructure/middleware/compression.go

import "github.com/gin-contrib/gzip"

func CompressionMiddleware() gin.HandlerFunc {
    return gzip.Gzip(gzip.DefaultCompression, gzip.WithExcludedPaths([]string{
        "/health",
        "/metrics",
    }))
}
```

### 6.3 Pagination Best Practices

```go
// Use cursor-based pagination for large datasets
type CursorPagination struct {
    Cursor  string `json:"cursor"`
    Limit   int    `json:"limit"`
    HasMore bool   `json:"has_more"`
}

// Keyset pagination query (more efficient than OFFSET)
func (r *ClientRepository) ListByCursor(ctx context.Context, agentID int64, cursor string, limit int) ([]Client, string, error) {
    query := `
        SELECT id, first_name, last_name, email, created_at
        FROM re_buyers b
        INNER JOIN re_agent_buyers ab ON b.id = ab.buyer_id
        WHERE ab.agent_id = ?
          AND b.deleted_at IS NULL
          AND (b.created_at, b.id) < (?, ?)
        ORDER BY b.created_at DESC, b.id DESC
        LIMIT ?
    `

    cursorTime, cursorID := parseCursor(cursor)
    rows, err := r.db.QueryContext(ctx, query, agentID, cursorTime, cursorID, limit+1)
    // ... process rows and build next cursor
}
```

---

## 7. Monitoring and Alerting

### 7.1 Key Metrics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MONITORING METRICS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Application Metrics:                                                        │
│  ├── request_count_total{method, path, status}                              │
│  ├── request_duration_seconds{method, path}                                 │
│  ├── request_in_flight                                                      │
│  └── error_count_total{type}                                                │
│                                                                              │
│  Cache Metrics:                                                              │
│  ├── cache_hits_total                                                       │
│  ├── cache_misses_total                                                     │
│  ├── cache_hit_ratio                                                        │
│  └── cache_operation_duration_seconds{operation}                            │
│                                                                              │
│  Database Metrics:                                                           │
│  ├── db_connections_open                                                    │
│  ├── db_connections_in_use                                                  │
│  ├── db_query_duration_seconds{query_type}                                  │
│  └── db_errors_total{type}                                                  │
│                                                                              │
│  Business Metrics:                                                           │
│  ├── active_users                                                           │
│  ├── api_calls_per_user                                                     │
│  └── feature_usage{feature}                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Response Time (p99) | > 300ms | > 500ms | Scale up or investigate |
| Error Rate | > 1% | > 5% | Investigate immediately |
| CPU Usage | > 70% | > 85% | Scale up |
| Memory Usage | > 80% | > 90% | Scale up or memory leak |
| Cache Hit Rate | < 70% | < 50% | Review cache strategy |
| DB Connection Pool | > 80% | > 90% | Increase pool or optimize |

### 7.3 Health Check Endpoint

```go
// internal/interfaces/http/handlers/health_handler.go

type HealthResponse struct {
    Status    string            `json:"status"`
    Timestamp time.Time         `json:"timestamp"`
    Checks    map[string]string `json:"checks"`
}

func (h *HealthHandler) Health(c *gin.Context) {
    checks := make(map[string]string)

    // Check database
    if err := h.db.Ping(); err != nil {
        checks["database"] = "unhealthy"
    } else {
        checks["database"] = "healthy"
    }

    // Check Redis
    if err := h.redis.Ping(c.Request.Context()).Err(); err != nil {
        checks["cache"] = "unhealthy"
    } else {
        checks["cache"] = "healthy"
    }

    // Determine overall status
    status := "healthy"
    for _, v := range checks {
        if v == "unhealthy" {
            status = "unhealthy"
            break
        }
    }

    statusCode := http.StatusOK
    if status == "unhealthy" {
        statusCode = http.StatusServiceUnavailable
    }

    c.JSON(statusCode, HealthResponse{
        Status:    status,
        Timestamp: time.Now(),
        Checks:    checks,
    })
}
```

---

## Summary

This scalability documentation provides comprehensive guidance for:

- **Capacity Planning**: 10K concurrent users, 1,000+ RPS target
- **Infrastructure**: 3-node API cluster, Redis cluster, MySQL with replicas
- **Caching**: Multi-layer caching with 80%+ hit rate target
- **Database**: Read/write splitting, connection pooling, query optimization
- **Performance**: Go optimizations, compression, efficient pagination
- **Monitoring**: Key metrics, alert thresholds, health checks

The architecture is designed to scale horizontally with auto-scaling rules and can handle significant traffic growth beyond the initial 10K user target.

For related documentation:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SECURITY.md](./SECURITY.md) - Security implementation
