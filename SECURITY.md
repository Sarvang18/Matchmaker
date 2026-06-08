# Security Guidelines - TDC Matchmaker

## ⚠️ CRITICAL: Before Deployment

### 1. Remove Sensitive Files from Git

The following files contain real credentials and **MUST NOT** be committed:

```bash
# Remove from Git tracking
git rm --cached .env .env.local

# Verify they're in .gitignore
cat .gitignore | grep .env
```

### 2. Rotate ALL Compromised Credentials

If you've already pushed `.env` files to GitHub, **ALL** credentials are compromised and must be rotated:

#### Gmail SMTP
1. Go to https://myaccount.google.com/apppasswords
2. Delete old app password
3. Generate new 16-character password
4. Update `GMAIL_APP_PASSWORD` in production

#### AWS Credentials
1. Go to IAM Console
2. Delete user: `tdc-matchmaker-s3-user`
3. Create new IAM user with S3 permissions
4. Generate new access keys
5. Update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

#### Gemini API Key
1. Go to https://aistudio.google.com/
2. Delete old API key
3. Generate new API key
4. Update `GEMINI_API_KEY`

#### NextAuth Secret
```bash
openssl rand -base64 32
```
Update `NEXTAUTH_SECRET` with new value

#### Magic Link Secret
```bash
openssl rand -hex 32
```
Update `MAGIC_LINK_SECRET` with new value

#### Resend API Key (if using)
1. Go to Resend Dashboard
2. Delete old API key
3. Generate new key
4. Update `RESEND_API_KEY`

### 3. Update Production Environment Variables

After rotating, update ALL environment variables in:
- Vercel Dashboard > Project Settings > Environment Variables
- Local `.env` file (create fresh from `.env.example`)

---

## 🔒 Security Best Practices

### Authentication & Authorization

✅ **Implemented:**
- NextAuth.js with JWT strategy
- Bcrypt password hashing (10 rounds)
- Session-based authentication
- Protected routes via middleware
- Authorization checks on API routes

⚠️ **Missing:**
- Password reset functionality
- Account lockout after failed attempts
- Session timeout configuration
- 2FA support

### API Security

✅ **Implemented:**
- Input validation with Zod
- SQL injection protection (Prisma ORM)
- XSS protection (React escaping)
- Environment variable separation

⚠️ **Missing:**
- Rate limiting on public endpoints
- CSRF protection
- Request size limits
- API key rotation policy

### Data Protection

✅ **Implemented:**
- Passwords never stored in plain text
- JWT tokens for session management
- Secure cookie configuration
- Database connection over SSL

⚠️ **Missing:**
- Field-level encryption for sensitive data
- Data retention policy
- Audit logging
- PII masking in logs

---

## 🛡️ Security Checklist

### Before Production Launch

- [ ] Remove all `.env` files from Git
- [ ] Rotate all compromised credentials
- [ ] Enable HTTPS only (Vercel default)
- [ ] Set secure environment variables in Vercel
- [ ] Enable AWS RDS encryption at rest
- [ ] Configure S3 bucket policy for minimum permissions
- [ ] Set up AWS CloudWatch alerts
- [ ] Enable Vercel deployment protection
- [ ] Configure rate limiting
- [ ] Add CORS restrictions
- [ ] Set up monitoring and alerting
- [ ] Create incident response plan

### Post-Deployment

- [ ] Change default matchmaker password
- [ ] Review access logs weekly
- [ ] Monitor failed login attempts
- [ ] Review S3 access logs
- [ ] Audit database permissions
- [ ] Update dependencies monthly
- [ ] Review Vercel security headers
- [ ] Test backup restoration process

---

## 🚨 Incident Response

### If Credentials Are Leaked

1. **Immediate Actions (Within 1 hour):**
   - Rotate compromised credentials
   - Review access logs for suspicious activity
   - Notify team members
   - Document incident timeline

2. **Investigation (Within 24 hours):**
   - Check for unauthorized access
   - Review database for data changes
   - Audit S3 bucket for unauthorized uploads
   - Check email logs for spam sent

3. **Recovery (Within 48 hours):**
   - Update all production systems
   - Restore from backup if needed
   - Implement additional monitoring
   - Review and update security policies

### If Database Is Compromised

1. **Immediate Actions:**
   - Disable database public access
   - Change database password
   - Export database backup
   - Review recent queries

2. **Investigation:**
   - Check for data exfiltration
   - Review user account changes
   - Audit client record modifications
   - Check for malicious data insertion

3. **Recovery:**
   - Restore from clean backup
   - Reset all user passwords
   - Enable enhanced monitoring
   - Conduct security audit

---

## 📞 Security Contacts

**Project Owner:** [Add contact]  
**DevOps Lead:** [Add contact]  
**AWS Admin:** [Add contact]  

**Emergency Escalation:**  
1. Rotate credentials immediately
2. Contact project owner
3. Document in security log
4. Follow incident response plan

---

## 🔐 Environment Variables Reference

### Required (All Environments)

| Variable | Type | Rotation | Notes |
|----------|------|----------|-------|
| `DATABASE_URL` | Secret | Quarterly | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret | Quarterly | 32+ character random string |
| `NEXTAUTH_URL` | Config | - | Production URL |
| `GEMINI_API_KEY` | Secret | Quarterly | Google AI API key |
| `GMAIL_USER` | Config | - | Gmail address |
| `GMAIL_APP_PASSWORD` | Secret | Quarterly | 16-char app password |
| `MAGIC_LINK_SECRET` | Secret | Quarterly | 64-char hex string |
| `AWS_ACCESS_KEY_ID` | Secret | Quarterly | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | Secret | Quarterly | IAM secret key |
| `AWS_S3_BUCKET` | Config | - | S3 bucket name |
| `AWS_REGION` | Config | - | AWS region code |
| `REDIS_URL` | Secret | Quarterly | Redis connection string |

### Optional

| Variable | Type | Purpose |
|----------|------|---------|
| `RESEND_API_KEY` | Secret | Alternative email provider |
| `NODE_ENV` | Config | Environment mode |

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/authentication)
- [Vercel Security](https://vercel.com/docs/security)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [Prisma Security](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Last Updated**: June 8, 2026  
**Next Review**: After production deployment  
**Status**: Active
