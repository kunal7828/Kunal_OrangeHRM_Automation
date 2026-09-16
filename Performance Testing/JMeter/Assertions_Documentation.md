# JMeter Assertions Documentation

## Test Plan: OrangeHRM Performance Test

---

### Assertion Types Used

1. **Response Assertion** - Validates response content, code, or headers
2. **Duration Assertion** - Validates response time thresholds
3. **Size Assertion** - Validates response size (optional)

---

### Detailed Assertions per Request

#### 1. GET /web/index.php/auth/login
| Assertion Name | Type | Field | Pattern/Value | Match Type | Expected Result |
|----------------|------|-------|---------------|------------|-----------------|
| Assert Login Page Loaded | Response Assertion | Response Text | OrangeHRM | Contains | PASS if "OrangeHRM" text present in HTML |

**Purpose**: Verify login page renders correctly before attempting authentication.

---

#### 2. POST /web/index.php/auth/validate
| Assertion Name | Type | Field | Pattern/Value | Match Type | Expected Result |
|----------------|------|-------|---------------|------------|-----------------|
| Assert Login Success | Response Assertion | Response Text | dashboard | Contains | PASS if redirected to dashboard |

**Purpose**: Confirm successful authentication and session establishment.

---

#### 3. GET /web/index.php/pim/addEmployee
| Assertion Name | Type | Field | Pattern/Value | Match Type | Expected Result |
|----------------|------|-------|---------------|------------|-----------------|
| Assert Add Employee Page | Response Assertion | Response Text | Add Employee | Contains | PASS if add employee form loads |

**Purpose**: Verify navigation to PIM > Add Employee module works.

---

#### 4. POST /web/index.php/api/v2/pim/employees
| Assertion Name | Type | Field | Pattern/Value | Match Type | Expected Result |
|----------------|------|-------|---------------|------------|-----------------|
| Assert Employee Created - Status | Response Assertion | Response Code | 200 | Equals | PASS if HTTP 200 OK |
| Assert Employee Created - Content | Response Assertion | Response Text | successfully | Contains | PASS if success message in response |

**Purpose**: Validate employee creation via API returns success.

**Post-Processor (Not Assertion):**
- **JSON Extractor**: `employeeId` from `$.data.empNumber` - Stores for DELETE request

---

#### 5. GET /web/index.php/pim/viewEmployeeList
| Assertion Name | Type | Field | Pattern/Value | Match Type | Expected Result |
|----------------|------|-------|---------------|------------|-----------------|
| Assert Employee List Page | Response Assertion | Response Text | Employee List | Contains | PASS if employee list table renders |

**Purpose**: Verify employee search/list functionality works.

---

#### 6. DELETE /web/index.php/api/v2/pim/employees/{id}
| Assertion Name | Type | Field | Pattern/Value | Match Type | Expected Result |
|----------------|------|-------|---------------|------------|-----------------|
| Assert Employee Deleted | Response Assertion | Response Code | 200 | Equals | PASS if HTTP 200 OK on deletion |

**Purpose**: Confirm employee deletion via API succeeds.

---

### Additional Recommended Assertions (Can Be Added)

#### Duration Assertions (Response Time SLAs)
| Request | Max Duration (ms) | Assertion Config |
|---------|------------------|------------------|
| GET Login Page | 5000 | Duration Assertion ≤ 5000ms |
| POST Login | 8000 | Duration Assertion ≤ 8000ms |
| GET Add Employee | 5000 | Duration Assertion ≤ 5000ms |
| POST Create Employee | 10000 | Duration Assertion ≤ 10000ms |
| GET Employee List | 5000 | Duration Assertion ≤ 5000ms |
| DELETE Employee | 5000 | Duration Assertion ≤ 5000ms |

**To Add in JMeter:**
1. Right-click request → Add → Assertions → Duration Assertion
2. Set "Duration in milliseconds" to values above
3. Apply to: Main sample only

#### Size Assertions (Optional)
| Request | Min Size (bytes) | Max Size (bytes) |
|---------|-----------------|-----------------|
| GET Login Page | 1000 | 500000 |
| POST Login | 500 | 200000 |
| GET Add Employee | 1000 | 500000 |
| POST Create Employee | 200 | 100000 |
| GET Employee List | 1000 | 1000000 |
| DELETE Employee | 100 | 50000 |

---

### Assertion Results in Reports

**View Results Tree** shows:
- ✅ Green check = All assertions passed
- ❌ Red X = At least one assertion failed
- Click assertion name to see expected vs actual

**Summary Report / Aggregate Report** includes:
- **Error %** = (Failed assertions / Total samples) × 100
- **Assertion Failures** counted as errors

---

### Failure Scenarios & Expected Behavior

| Scenario | Assertion That Fails | Thread Behavior |
|----------|---------------------|-----------------|
| Login page down | Assert Login Page Loaded | Continue (ThreadGroup.on_sample_error=continue) |
| Invalid credentials | Assert Login Success | Continue |
| Add Employee page error | Assert Add Employee Page | Continue |
| API create fails (4xx/5xx) | Assert Employee Created - Status | Continue |
| Employee list not loading | Assert Employee List Page | Continue |
| Delete fails | Assert Employee Deleted | Continue |

**Note**: Thread continues to next iteration on assertion failure due to `ThreadGroup.on_sample_error=continue`

---

### Custom Assertion Messages (For Better Reporting)

Each Response Assertion can have custom failure message:
```
Assertion: Assert Login Success
Failure Message: "Login failed - dashboard not found in response. Possible causes: invalid credentials, session expired, or application error."
```

**To Set in JMeter:**
1. Select Response Assertion
2. Check "Assume Success" = False
3. Add custom message in "Assertion Failure Message" field (JMeter 5.5+)

---

### Validation Checklist for Test Run

Before running load test, verify:
- [ ] All 6 requests have at least 1 Response Assertion
- [ ] Assertion patterns match current OrangeHRM demo site
- [ ] JSON Extractor correctly extracts `employeeId`
- [ ] `${employeeId}` variable used in DELETE request path
- [ ] Cookie Manager maintains session across requests
- [ ] Cache Manager clears cache each iteration
- [ ] Thread Group configured: 5 threads, 10 loops, 10s ramp-up