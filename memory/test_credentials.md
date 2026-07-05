# Test credentials — WeddingFilma

## Admin (Supabase Auth)
Create this user in Supabase → Authentication → Users after applying migrations,
then elevate role in SQL editor:

```sql
update public.profiles set role = 'ADMIN' where email = 'admin@weddingfilma.in';
```

- **Email:** admin@weddingfilma.in
- **Password:** WeddingFilma@2026  (change on first login)

_Note: These credentials are placeholders until the user creates the Supabase
project. Auth is not yet functional in this environment because Supabase URL /
keys are placeholder values (`YOUR_SUPABASE_URL`, etc.)._
