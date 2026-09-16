# JMeter Thread/User Configuration

## Test Plan: OrangeHRM Performance Test

### Thread Group Configuration
| Parameter | Value | Description |
|-----------|-------|-------------|
| **Number of Threads (Users)** | 5 | Concurrent virtual users simulating real users |
| **Ramp-Up Period (seconds)** | 10 | Time to start all 5 threads (1 user every 2 seconds) |
| **Loop Count** | 10 | Each thread executes the test scenario 10 times |
| **Total Iterations** | 50 | 5 threads × 10 loops = 50 total test executions |
| **Duration** | Not set | Runs until all loops complete |
| **Delay Thread Creation** | False | Threads created immediately during ramp-up |
| **Same User on Next Iteration** | True | Maintains session/cookies across iterations |

### Load Profile
- **Pattern**: Ramp-up (gradual increase)
- **Peak Concurrent Users**: 5
- **Total Test Duration**: ~2-3 minutes (estimated)
- **Target Throughput**: ~5-10 requests/second

### Thread Behavior
- **On Sample Error**: Continue (don't stop thread on failure)
- **Cookies**: Maintained across iterations (HTTP Cookie Manager)
- **Cache**: Cleared each iteration (HTTP Cache Manager)
- **Headers**: Standard browser headers sent with each request

### Variables (User Defined)
| Variable | Value | Scope |
|----------|-------|-------|
| baseUrl | https://opensource-demo.orangehrmlive.com | Global |
| username | Admin | Global |
| password | admin123 | Global |

### Dynamic Data Generation
- **First Name**: `PerfTest{threadNum}_{iterationNum}` - Unique per thread/iteration
- **Last Name**: `Employee` - Static
- **Employee ID**: `EMP{Random(10000,99999)}` - Random 5-digit ID
- **Employee ID (extracted)**: `${employeeId}` - From API response for DELETE

### Test Scenarios per Thread
Each thread executes sequentially:
1. **Login Flow** (2 requests)
   - GET /web/index.php/auth/login
   - POST /web/index.php/auth/validate
2. **Add Employee Flow** (2 requests)
   - GET /web/index.php/pim/addEmployee
   - POST /web/index.php/api/v2/pim/employees
3. **Search Employee Flow** (1 request)
   - GET /web/index.php/pim/viewEmployeeList
4. **Delete Employee Flow** (1 request)
   - DELETE /web/index.php/api/v2/pim/employees/{id}

**Total Requests per Iteration**: 6 HTTP requests
**Total Requests per Test Run**: 300 requests (50 iterations × 6 requests)