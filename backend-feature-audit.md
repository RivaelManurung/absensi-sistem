# Backend Feature Audit

## Summary
Backend sudah diaudit dari route, middleware, handler, service, repository, model, response, migration AutoMigrate, dan seeder. Semua route yang diminta sudah terdaftar di `/api/v1`.

Status verifikasi kode: `go test ./...` lulus.

Status verifikasi runtime API: belum bisa dieksekusi penuh karena database lokal pada `.env` (`localhost:5433`, database `absensi`) menjawab `FATAL: database "absensi" does not exist`; port `5432` juga tidak ada service PostgreSQL aktif. Docker Desktop juga belum berjalan, sehingga endpoint HTTP belum bisa dites live tanpa setup DB.

## Seeder Summary
Seeder production-grade sudah dibuat modular di `internal/database/seeder/` dan dapat dijalankan ulang tanpa menggandakan seed data.

Jumlah data target yang dibuat saat database tersedia:
- Offices: 10
- Shifts: 5
- Employees: 50
- Attendances: 120

Runtime seeder saat audit: blocked oleh database lokal yang belum tersedia.

## Default Login Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | password123 |
| HR | hr@example.com | password123 |
| Employee | employee001@example.com | password123 |

## Feature Readiness Matrix
| Module | Route | Method | Auth | Role | Status | Notes |
|---|---|---|---|---|---|---|
| Auth | `/api/v1/auth/login` | POST | No | Public | Ready by code | Validasi email/password, bcrypt verify, JWT access token, refresh token hash. |
| Auth | `/api/v1/auth/me` | GET | Yes | Any authenticated | Ready by code | Mengambil claim dari JWT middleware. |
| Attendance | `/api/v1/attendance/check-in` | POST | Yes | Any authenticated with employee profile | Ready by code | Validasi lokasi, akurasi, radius, window shift, duplicate per hari. |
| Attendance | `/api/v1/attendance/check-out` | POST | Yes | Any authenticated with employee profile | Fixed | Sekarang validasi akurasi/radius dan status menjadi `checked_out`. |
| Attendance | `/api/v1/attendance/today` | GET | Yes | Any authenticated with employee profile | Ready by code | Mengambil attendance tanggal berjalan. |
| Attendance | `/api/v1/attendance/history` | GET | Yes | Any authenticated with employee profile | Ready by code | Pagination tersedia. |
| Reports | `/api/v1/admin/attendance/report` | GET | Yes | admin, hr | Fixed | Summary sebelumnya hardcoded nol, sekarang aggregate by status. |
| Employees | `/api/v1/admin/employees` | GET | Yes | admin, hr | Ready by code | Pagination, search, department, office filter. |
| Employees | `/api/v1/admin/employees` | POST | Yes | admin, hr | Fixed | Default `is_active=true` jika field tidak dikirim. |
| Employees | `/api/v1/admin/employees/:id` | GET | Yes | admin, hr | Ready by code | Preload user, office, shift; password hash tidak diekspos. |
| Employees | `/api/v1/admin/employees/:id` | PUT | Yes | admin, hr | Fixed | Update `is_active` preserve value jika field tidak dikirim. |
| Employees | `/api/v1/admin/employees/:id` | DELETE | Yes | admin, hr | Ready by code | Soft delete user dan employee dalam transaction. |
| Offices | `/api/v1/admin/offices` | GET | Yes | admin, hr | Ready by code | Pagination dan search termasuk `code`. |
| Offices | `/api/v1/admin/offices` | POST | Yes | admin, hr | Fixed | Field `code` ditambahkan dan wajib; unique index. |
| Offices | `/api/v1/admin/offices/:id` | GET | Yes | admin, hr | Ready by code | Ambil detail by UUID. |
| Offices | `/api/v1/admin/offices/:id` | PUT | Yes | admin, hr | Fixed | Field `code` ikut update; `is_active` preserve jika omitted. |
| Offices | `/api/v1/admin/offices/:id` | DELETE | Yes | admin, hr | Ready by code | Soft delete GORM. |
| Shifts | `/api/v1/admin/shifts` | GET | Yes | admin, hr | Ready by code | Pagination tersedia. |
| Shifts | `/api/v1/admin/shifts` | POST | Yes | admin, hr | Fixed | Field `code` dan `break_duration_minutes` ditambahkan. |
| Shifts | `/api/v1/admin/shifts/:id` | GET | Yes | admin, hr | Ready by code | Ambil detail by UUID. |
| Shifts | `/api/v1/admin/shifts/:id` | PUT | Yes | admin, hr | Fixed | Field baru ikut update; `is_active` preserve jika omitted. |
| Shifts | `/api/v1/admin/shifts/:id` | DELETE | Yes | admin, hr | Ready by code | Soft delete GORM. |

## Bugs Found
- Seeder lama hanya membuat 1 office, 1 shift, 3 user, dan memakai credential berbeda dari requirement.
- Model Office dan Shift belum punya `code`; Shift belum punya `break_duration_minutes`.
- Report summary selalu nol walaupun data attendance ada.
- Check-out belum memvalidasi akurasi/radius lokasi dan tidak mengubah status menjadi `checked_out`.
- CORS dipasang dua kali sehingga konfigurasi bisa konflik.
- Request `is_active` bertipe bool biasa, sehingga field yang tidak dikirim otomatis menjadi `false`.
- Refresh token service memiliki method yang belum diimplementasikan, tetapi route refresh/logout tidak terdaftar pada scope endpoint saat ini.
- Rate limit login ada di config tetapi belum diimplementasikan sebagai middleware.

## Fixes Applied
- Menambahkan field model `Office.Code`, `Shift.Code`, `Shift.BreakDurationMinutes`, dan status attendance `checked_in`.
- Menambahkan request/response support untuk `code` office/shift dan `break_duration_minutes`.
- Membuat seeder modular:
  - `internal/database/seeder/seeder.go`
  - `internal/database/seeder/office_seeder.go`
  - `internal/database/seeder/shift_seeder.go`
  - `internal/database/seeder/employee_seeder.go`
  - `internal/database/seeder/attendance_seeder.go`
- Seeder memakai transaction, bcrypt hash, duplicate protection, relasi foreign key valid, data realistis, dan log summary.
- Mengganti command `cmd/seed` lama agar menjalankan seeder modular.
- Memperbaiki report summary dengan aggregate database berdasarkan filter.
- Memperbaiki check-out agar validasi akurasi/radius dan update status.
- Menghapus duplicate CORS middleware di `cmd/api/main.go` dan memakai konfigurasi CORS tunggal di routes.
- Mengubah `is_active` request menjadi pointer bool agar create default active dan update preserve nilai lama.
- Membuat `docs/api-test.http` berisi request endpoint siap pakai.

## Security Notes
- Password hashing: sudah memakai bcrypt dan seeder tidak menyimpan plain password ke database.
- JWT validation: middleware memvalidasi Bearer token dengan access secret dan menaruh `user_id`, `email`, `role` ke context.
- Role middleware: admin routes dijaga oleh role `admin` dan `hr`.
- CORS: sekarang satu konfigurasi dari `CORS_ALLOWED_ORIGINS`; wildcard tidak memakai credentials.
- Rate limiting: belum ada middleware rate limit walaupun config `LOGIN_RATE_LIMIT_PER_MINUTE` tersedia.
- Sensitive data exposure: `PasswordHash` dan refresh token hash memakai `json:"-"`; response employee yang preload `User` tidak mengekspos hash.

## Seeder Command
Jalankan dari folder `backend-absensi` setelah database PostgreSQL tersedia:

```bash
go run ./cmd/seed
```

Seeder aman dijalankan ulang. Output yang diharapkan:

```txt
Seeder completed:
- Offices: 10 created / 0 skipped
- Shifts: 5 created / 0 skipped
- Employees: 50 created / 0 skipped
- Attendances: 120 created / 0 skipped
```

Pada run berikutnya angka created akan turun dan skipped naik sesuai data yang sudah ada.

## API Test Command
1. Pastikan database `absensi` tersedia sesuai `.env`.
2. Jalankan seeder:

```bash
go run ./cmd/seed
```

3. Jalankan API:

```bash
go run ./cmd/api
```

4. Buka dan jalankan request di:

```txt
docs/api-test.http
```

Login admin dan employee dulu, lalu isi variabel `@adminToken`, `@employeeToken`, `@officeId`, `@shiftId`, dan `@employeeId` dari response list/create.

## Remaining Issues
- Runtime endpoint belum dites live karena database lokal belum siap.
- Migration AutoMigrate akan menambahkan unique index `code` untuk offices/shifts; jika database existing sudah punya banyak row lama dengan `code=''`, data lama perlu dibersihkan/diberi code sebelum migrate.
- Refresh token rotation/logout belum diimplementasikan, tetapi tidak ada route publik untuk fitur itu saat ini.
- Login rate limiting belum diimplementasikan.
- Validasi UUID `office_id` dan `shift_id` pada employee create/update masih perlu error message yang lebih eksplisit jika format UUID invalid.
