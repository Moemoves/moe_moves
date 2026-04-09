-- ═══════════════════════════════════════════════════════════
-- MOÉ MOVES — Supabase Database Setup
-- Run this entire file in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ── BOOKINGS ─────────────────────────────────────────────
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  ref text unique,
  status text default 'Pending',
  service_type text,
  name text,
  phone text,
  whatsapp text,
  email text,
  source text,
  move_type text,
  home_size text,
  move_from text,
  move_to text,
  distance text,
  move_date date,
  move_time text,
  floor_level text,
  services text,
  heavy_items text,
  fragile_items text,
  package text,
  budget text,
  estimated_quote text,
  notes text,
  team_lead text,
  workers_assigned text,
  supervisor text,
  payment_status text default 'Not Paid',
  deposit_paid numeric default 0,
  total_amount numeric default 0,
  balance numeric default 0,
  job_date date,
  returning_customer boolean default false
);

-- ── CUSTOMERS ────────────────────────────────────────────
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text,
  phone text unique,
  whatsapp text,
  email text,
  address text,
  gender text,
  first_booking_date date,
  last_booking_date date,
  total_jobs integer default 0,
  total_spent numeric default 0,
  preferred_service text,
  source text,
  notes text
);

-- ── STAFF ────────────────────────────────────────────────
create table if not exists staff (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text,
  gender text,
  phone text,
  whatsapp text,
  email text,
  category text,
  role text,
  date_joined date,
  date_of_birth date,
  marital_status text,
  address text,
  next_of_kin_name text,
  next_of_kin_phone text,
  pay_rate numeric,
  pay_basis text,
  bank_name text,
  account_number text,
  account_name text,
  pin text,
  access_level text default 'View Bookings',
  status text default 'Active',
  total_jobs integer default 0,
  notes text
);

-- ── JOB ASSIGNMENTS ──────────────────────────────────────
create table if not exists job_assignments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  booking_id uuid references bookings(id) on delete cascade,
  staff_id uuid references staff(id) on delete cascade,
  staff_name text,
  role_on_job text,
  assigned_by text,
  notified boolean default false,
  confirmed boolean default false,
  notes text
);

-- ── STAFF PAYMENTS ───────────────────────────────────────
create table if not exists staff_payments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  booking_id uuid references bookings(id) on delete cascade,
  staff_id uuid references staff(id) on delete cascade,
  staff_name text,
  category text,
  service_delivered text,
  amount_agreed numeric default 0,
  amount_paid numeric default 0,
  balance numeric default 0,
  payment_date date,
  payment_method text,
  payment_status text default 'Pending',
  paid_by text,
  notes text
);

-- ── PARTNERS ─────────────────────────────────────────────
create table if not exists partners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  organisation text,
  category text,
  contact_name text,
  phone text,
  whatsapp text,
  email text,
  address text,
  fee_rate text,
  bank_name text,
  account_number text,
  account_name text,
  total_referrals integer default 0,
  total_earned numeric default 0,
  status text default 'Active',
  notes text
);

-- ── RECEIPTS ─────────────────────────────────────────────
create table if not exists receipts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  receipt_number text unique,
  invoice_number text,
  booking_id uuid references bookings(id) on delete set null,
  customer_name text,
  customer_phone text,
  service text,
  total_amount numeric default 0,
  amount_paid numeric default 0,
  balance numeric default 0,
  service_date date,
  payment_method text,
  payment_status text default 'Pending',
  issued_by text,
  notes text
);

-- ── INVOICES ─────────────────────────────────────────────
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  invoice_number text unique,
  booking_id uuid references bookings(id) on delete set null,
  customer_name text,
  customer_phone text,
  service text,
  line_items jsonb,
  total_amount numeric default 0,
  deposit_received numeric default 0,
  balance_due numeric default 0,
  due_date date,
  payment_status text default 'Not Paid',
  date_paid date,
  issued_by text,
  notes text
);

-- ── INVENTORY ────────────────────────────────────────────
create table if not exists inventory (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  item_name text,
  category text,
  unit text,
  current_stock integer default 0,
  minimum_stock integer default 0,
  unit_cost numeric default 0,
  supplier text,
  supplier_phone text,
  last_restocked date,
  notes text
);

-- ── FINANCES ─────────────────────────────────────────────
create table if not exists finances (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  type text,
  date date,
  description text,
  category text,
  amount numeric default 0,
  payment_method text,
  booking_id uuid references bookings(id) on delete set null,
  recorded_by text,
  notes text
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────
alter table bookings enable row level security;
alter table customers enable row level security;
alter table staff enable row level security;
alter table job_assignments enable row level security;
alter table staff_payments enable row level security;
alter table partners enable row level security;
alter table receipts enable row level security;
alter table invoices enable row level security;
alter table inventory enable row level security;
alter table finances enable row level security;

-- Allow anon key to read/write all tables (dashboard uses anon key)
create policy "Allow all for anon" on bookings for all using (true) with check (true);
create policy "Allow all for anon" on customers for all using (true) with check (true);
create policy "Allow all for anon" on staff for all using (true) with check (true);
create policy "Allow all for anon" on job_assignments for all using (true) with check (true);
create policy "Allow all for anon" on staff_payments for all using (true) with check (true);
create policy "Allow all for anon" on partners for all using (true) with check (true);
create policy "Allow all for anon" on receipts for all using (true) with check (true);
create policy "Allow all for anon" on invoices for all using (true) with check (true);
create policy "Allow all for anon" on inventory for all using (true) with check (true);
create policy "Allow all for anon" on finances for all using (true) with check (true);

