# JMeter HTTP Requests Documentation

## Test Plan: OrangeHRM Performance Test

---

### Request 1: GET Login Page
| Attribute | Value |
|-----------|-------|
| **Name** | GET /web/index.php/auth/login |
| **Method** | GET |
| **Path** | /web/index.php/auth/login |
| **Protocol** | HTTPS |
| **Domain** | opensource-demo.orangehrmlive.com |
| **Port** | 443 |
| **Follow Redirects** | True |
| **Use KeepAlive** | True |
| **Timeout** | Default (60s connect, 60s response) |

**Assertions:**
- Response contains "OrangeHRM" (Response Assertion - Contains)

---

### Request 2: POST Login Validation
| Attribute | Value |
|-----------|-------|
| **Name** | POST /web/index.php/auth/validate |
| **Method** | POST |
| **Path** | /web/index.php/auth/validate |
| **Protocol** | HTTPS |
| **Domain** | opensource-demo.orangehrmlive.com |
| **Port** | 443 |
| **Content-Type** | application/x-www-form-urlencoded |
| **Follow Redirects** | True |
| **Use KeepAlive** | True |

**Parameters:**
| Name | Value | Description |
|------|-------|-------------|
| username | Admin | From User Defined Variables |
| password | admin123 | From User Defined Variables |
| _token | ${csrf_token} | CSRF token extracted from login page |

**Assertions:**
- Response contains "dashboard" (Response Assertion - Contains)

---

### Request 3: GET Add Employee Page
| Attribute | Value |
|-----------|-------|
| **Name** | GET /web/index.php/pim/addEmployee |
| **Method** | GET |
| **Path** | /web/index.php/pim/addEmployee |
| **Protocol** | HTTPS |
| **Domain** | opensource-demo.orangehrmlive.com |
| **Port** | 443 |
| **Follow Redirects** | True |
| **Use KeepAlive** | True |

**Assertions:**
- Response contains "Add Employee" (Response Assertion - Contains)

---

### Request 4: POST Create Employee (API)
| Attribute | Value |
|-----------|-------|
| **Name** | POST /web/index.php/api/v2/pim/employees |
| **Method** | POST |
| **Path** | /web/index.php/api/v2/pim/employees |
| **Protocol** | HTTPS |
| **Domain** | opensource-demo.orangehrmlive.com |
| **Port** | 443 |
| **Content-Type** | multipart/form-data |
| **Follow Redirects** | True |
| **Use KeepAlive** | True |

**Parameters:**
| Name | Value | Description |
|------|-------|-------------|
| firstName | PerfTest${__threadNum}_${__iterationNum} | Unique per thread & iteration |
| lastName | Employee | Static |
| employeeId | EMP${__Random(10000,99999)} | Random 5-digit ID |

**Assertions:**
- Response Code = 200 (Response Assertion - Equals)
- Response contains "successfully" (Response Assertion - Contains)

**Post-Processors:**
- **JSON Extractor**: Extract `employeeId` from `$.data.empNumber` for use in DELETE request

---

### Request 5: GET Employee List (Search)
| Attribute | Value |
|-----------|-------|
| **Name** | GET /web/index.php/pim/viewEmployeeList |
| **Method** | GET |
| **Path** | /web/index.php/pim/viewEmployeeList |
| **Protocol** | HTTPS |
| **Domain** | opensource-demo.orangehrmlive.com |
| **Port** | 443 |
| **Follow Redirects** | True |
| **Use KeepAlive** | True |

**Assertions:**
- Response contains "Employee List" (Response Assertion - Contains)

---

### Request 6: DELETE Employee (API)
| Attribute | Value |
|-----------|-------|
| **Name** | DELETE /web/index.php/api/v2/pim/employees/{id} |
| **Method** | DELETE |
| **Path** | /web/index.php/api/v2/pim/employees/${employeeId} |
| **Protocol** | HTTPS |
| **Domain** | opensource-demo.orangehrmlive.com |
| **Port** | 443 |
| **Follow Redirects** | True |
| **Use KeepAlive** | True |

**Assertions:**
- Response Code = 200 (Response Assertion - Equals)

---

## Common Configuration

### HTTP Request Defaults
- **Domain**: opensource-demo.orangehrmlive.com
- **Port**: 443
- **Protocol**: https
- **Content Encoding**: utf-8
- **Timeouts**: 60s connect, 60s response

### HTTP Header Manager (Applied to All Requests)
| Header | Value |
|--------|-------|
| Content-Type | application/x-www-form-urlencoded |
| Accept | text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 |
| User-Agent | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 |

### HTTP Cookie Manager
- **Clear Cookies Each Iteration**: False (maintains session)
- **Allow Variable Cookies**: True

### HTTP Cache Manager
- **Clear Cache Each Iteration**: True
- **Use Expires Headers**: True

---

## Request Flow Diagram
```
Thread Start
    │
    ▼
┌─────────────────────────────┐
│ 1. GET /auth/login          │ ──► Assert: "OrangeHRM"
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ 2. POST /auth/validate      │ ──► Assert: "dashboard"
│    (username, password)     │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ 3. GET /pim/addEmployee     │ ──► Assert: "Add Employee"
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ 4. POST /api/v2/pim/        │ ──► Assert: 200 + "successfully"
│    employees                │
│    (firstName, lastName,    │
│     employeeId)             │
│    Extract: employeeId      │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ 5. GET /pim/viewEmployeeList│ ──► Assert: "Employee List"
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ 6. DELETE /api/v2/pim/      │ ──► Assert: 200
│    employees/{employeeId}   │
└─────────────────────────────┘
    │
    ▼
Loop / Thread End
```

---

## Expected Response Times (Baseline Targets)
| Request | Target Avg Response Time | Max Acceptable |
|---------|-------------------------|----------------|
| GET Login Page | < 2s | < 5s |
| POST Login | < 3s | < 8s |
| GET Add Employee | < 2s | < 5s |
| POST Create Employee | < 3s | < 10s |
| GET Employee List | < 2s | < 5s |
| DELETE Employee | < 2s | < 5s |