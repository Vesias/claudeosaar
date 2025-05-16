# ClaudeOSaar Security Hardening v2.2.0

This document outlines the security hardening measures implemented in ClaudeOSaar v2.2.0 to improve the overall security posture of the application.

## TLS/SSL Configuration

SSL/TLS has been implemented to encrypt all communications between clients and the ClaudeOSaar API server.

### Implementation Details

1. Added SSL/TLS support to both Express and FastAPI servers
2. Created self-signed certificate generation script for development
3. Added secure configuration with modern cipher suites
4. Configured HTTPS server creation in both Node.js and Python
5. Added SSL certificate volume mounts in Docker Compose

### Configuration Options

SSL/TLS settings can be configured via environment variables:

```
USE_SSL=true
SSL_KEYFILE=/etc/ssl/private/claudeosaar.key
SSL_CERTFILE=/etc/ssl/certs/claudeosaar.crt
SSL_CA_CERTS=/etc/ssl/certs/ca.crt
SSL_CIPHERS=TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES256-GCM-SHA384
```

For production, we recommend using a properly signed certificate from a trusted CA like Let's Encrypt.

## HTTP Strict Transport Security (HSTS)

HSTS ensures that clients connect to the server only via secure HTTPS connections, protecting against protocol downgrade attacks and cookie hijacking.

### Implementation Details

1. Added HSTS headers to all responses when SSL is enabled
2. Configured with a 1-year max-age (31536000 seconds)
3. Enabled includeSubDomains and preload flags

### Configuration Options

HSTS settings can be configured via environment variables:

```
ENABLE_HSTS=true
HSTS_MAX_AGE=31536000
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=true
```

## CORS/CSRF Protections

Cross-Origin Resource Sharing (CORS) and Cross-Site Request Forgery (CSRF) protections have been implemented to prevent unauthorized cross-origin requests.

### CORS Implementation

1. Replaced wildcard origins with explicit allowed origins
2. Limited allowed methods to specific HTTP methods
3. Limited allowed headers to necessary headers
4. Added exposure of rate limit headers
5. Configured preflight caching for 24 hours

### CSRF Implementation

1. Implemented double-submit cookie pattern for CSRF protection
2. Created CSRF token generation and validation middleware
3. Excluded API endpoints using Bearer token authentication
4. Added CSRF token cookie with appropriate security flags
5. Implemented CSRF validation for unsafe HTTP methods (POST, PUT, DELETE, PATCH)

### Configuration Options

```
CORS_ORIGINS=http://localhost:3000,https://claudeosaar.saarland
CSRF_SECRET=<random-token>
CSRF_COOKIE_SECURE=true
CSRF_COOKIE_HTTPONLY=false
CSRF_COOKIE_SAMESITE=lax
CSRF_HEADER_NAME=X-CSRF-Token
```

## AppArmor Profiles

AppArmor provides Mandatory Access Control (MAC) to restrict programs to a limited set of resources.

### Implementation Details

1. Created ClaudeOSaar-specific AppArmor profile
2. Added restrictions for file access, network, and capabilities
3. Created setup script for AppArmor profile installation
4. Added AppArmor profile enforcement in Docker Compose

### Profile Features

- Restricts file system access to necessary directories
- Limits network capabilities to TCP/UDP only
- Denies access to sensitive system files
- Restricts dangerous capabilities
- Allows only required signals between processes

## Redis Key Expiration for Session Cleanup

Implemented automatic session expiration in Redis to prevent session data accumulation and potential memory exhaustion.

### Implementation Details

1. Created Redis connection module with TTL support
2. Added session management functions with expiry
3. Implemented sliding expiry for active sessions
4. Configured Redis memory limits and eviction policies
5. Added Redis configuration in Docker Compose

### Configuration Options

```
SESSION_EXPIRY=86400
REDIS_URL=redis://cache:6379
REDIS_PASSWORD=<password>
REDIS_SSL=false
```

## Additional Security Measures

### Content Security Policy (CSP)

Implemented Content Security Policy headers to prevent XSS and other code injection attacks by controlling which resources can be loaded.

### Security Headers

Added various security headers:
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrictions on browser features

### Secure Cookies

Enhanced cookie security:
- httpOnly flag to prevent JavaScript access
- secure flag to ensure HTTPS-only cookies
- SameSite attribute to prevent CSRF
- Signed cookies for tampering protection

### Request Rate Limiting

Improved rate limiting:
- Added per-minute, per-hour, and per-day limits
- Implemented sliding window rate limiting
- Added client identification by user ID or IP address
- Added rate limit headers for client awareness

## Implementation and Deployment

To implement these security measures, run the security hardening script:

```bash
cd /path/to/claudeosaar/containers
./security-hardening.sh
```

For container security, the AppArmor profile must be installed:

```bash
sudo ./apparmor/setup-apparmor.sh
```

For SSL certificates, the generation script can be used:

```bash
./ssl/generate-certs.sh [domain]
```

## Best Practices

1. **Regular Updates**: Keep all dependencies and system components up to date
2. **Principle of Least Privilege**: Grant only necessary permissions
3. **Defense in Depth**: Implement multiple security layers 
4. **Secure Coding**: Follow secure coding practices and conduct code reviews
5. **Monitoring**: Implement comprehensive logging and monitoring
6. **Security Testing**: Regularly conduct security testing including penetration testing

## Notes for Production Deployment

1. Use properly signed SSL certificates from a trusted CA
2. Configure more restrictive CORS settings for production
3. Set more restrictive CSP headers for production
4. Use a more strict AppArmor profile for production
5. Implement proper network segmentation and firewall rules
6. Consider additional security measures like Web Application Firewall (WAF)

## Conclusion

The security hardening measures implemented in ClaudeOSaar v2.2.0 significantly improve the application's security posture by addressing common vulnerabilities and following security best practices. Regular security reviews and updates should be conducted to maintain and enhance security over time.