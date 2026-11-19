create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  created_at timestamptz not null default now()
);

create table if not exists public.review_moderators (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  name_ja text,
  category text not null default 'restaurant',
  subcategory text not null default 'other',
  budget_jpy integer,
  price_min_jpy integer,
  price_max_jpy integer,
  city text not null default 'Tokyo' check (char_length(btrim(city)) between 2 and 80),
  neighborhood text not null check (char_length(btrim(neighborhood)) between 2 and 80),
  address text not null check (char_length(btrim(address)) between 5 and 240),
  description text not null check (char_length(btrim(description)) between 20 and 1200),
  opening_hours text,
  nearest_station text,
  maps_url text,
  website_url text check (website_url is null or website_url ~ '^https?://'),
  source_url text not null check (source_url ~ '^https?://'),
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.places
  add column if not exists subcategory text not null default 'other',
  add column if not exists budget_jpy integer,
  add column if not exists name_ja text,
  add column if not exists price_min_jpy integer,
  add column if not exists price_max_jpy integer,
  add column if not exists opening_hours text,
  add column if not exists nearest_station text,
  add column if not exists maps_url text;

alter table public.places
  drop constraint if exists places_category_check,
  drop constraint if exists places_category_subcategory_check,
  drop constraint if exists places_budget_jpy_check,
  drop constraint if exists places_name_ja_check,
  drop constraint if exists places_price_range_check,
  drop constraint if exists places_opening_hours_check,
  drop constraint if exists places_nearest_station_check,
  drop constraint if exists places_maps_url_check;

alter table public.places
  add constraint places_category_check
    check (category in ('restaurant', 'shopping', 'services', 'visits')),
  add constraint places_category_subcategory_check
    check (
      (category = 'restaurant' and subcategory in ('other', 'affordable', 'halal', 'no-pork', 'african', 'ramen'))
      or (category = 'shopping' and subcategory in ('other', 'thrift', 'tax-free', 'pharmacy'))
      or (category = 'services' and subcategory in ('other', 'currency-exchange', 'foreign-atm', 'pocket-wifi', 'esim'))
      or (category = 'visits' and subcategory in ('other', 'neighborhood'))
    ),
  add constraint places_budget_jpy_check
    check (budget_jpy is null or budget_jpy >= 0),
  add constraint places_name_ja_check
    check (name_ja is null or char_length(btrim(name_ja)) between 1 and 120),
  add constraint places_price_range_check
    check (
      (price_min_jpy is null and price_max_jpy is null)
      or (
        price_min_jpy is not null
        and price_max_jpy is not null
        and price_min_jpy >= 0
        and price_max_jpy >= price_min_jpy
      )
    ),
  add constraint places_opening_hours_check
    check (opening_hours is null or char_length(btrim(opening_hours)) between 1 and 240),
  add constraint places_nearest_station_check
    check (nearest_station is null or char_length(btrim(nearest_station)) between 1 and 120),
  add constraint places_maps_url_check
    check (maps_url is null or maps_url ~ '^https?://');

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(btrim(title)) between 3 and 100),
  body text not null check (char_length(btrim(body)) between 20 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_place_author_unique unique (place_id, author_id)
);

create index if not exists places_published_city_idx
  on public.places (city, neighborhood, name)
  where status = 'published';
create index if not exists places_published_category_idx
  on public.places (category, subcategory, city, neighborhood)
  where status = 'published';
create index if not exists reviews_place_approved_created_idx
  on public.reviews (place_id, created_at desc)
  where status = 'approved';
create index if not exists reviews_author_idx
  on public.reviews (author_id, created_at desc);

create or replace function public.is_review_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_moderators
    where user_id = (select auth.uid())
  );
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
begin
  requested_name := left(
    btrim(coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))),
    60
  );

  if char_length(requested_name) < 2 then
    requested_name := 'Voyageur';
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, requested_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists places_set_updated_at on public.places;
create trigger places_set_updated_at
  before update on public.places
  for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.review_moderators enable row level security;
alter table public.places enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Public can read display names" on public.profiles;
create policy "Public can read display names"
  on public.profiles for select to anon, authenticated
  using (
    id = (select auth.uid())
    or exists (
      select 1
      from public.reviews
      where reviews.author_id = profiles.id
        and reviews.status = 'approved'
    )
    or (select public.is_review_moderator())
  );

drop policy if exists "Users can update their display name" on public.profiles;
create policy "Users can update their display name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Moderators can see their own role" on public.review_moderators;
create policy "Moderators can see their own role"
  on public.review_moderators for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Published places are public" on public.places;
create policy "Published places are public"
  on public.places for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Moderators can manage places" on public.places;
create policy "Moderators can manage places"
  on public.places for all to authenticated
  using ((select public.is_review_moderator()))
  with check ((select public.is_review_moderator()));

drop policy if exists "Approved reviews and own reviews are readable" on public.reviews;
create policy "Approved reviews and own reviews are readable"
  on public.reviews for select to anon, authenticated
  using (
    status = 'approved'
    or author_id = (select auth.uid())
    or (select public.is_review_moderator())
  );

drop policy if exists "Signed-in users can submit pending reviews" on public.reviews;
create policy "Signed-in users can submit pending reviews"
  on public.reviews for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and status = 'pending'
    and exists (
      select 1
      from public.places
      where places.id = reviews.place_id
        and places.status = 'published'
    )
  );

drop policy if exists "Authors and moderators can update reviews" on public.reviews;
create policy "Authors and moderators can update reviews"
  on public.reviews for update to authenticated
  using (
    author_id = (select auth.uid())
    or (select public.is_review_moderator())
  )
  with check (
    (author_id = (select auth.uid()) and status = 'pending')
    or (select public.is_review_moderator())
  );

drop policy if exists "Authors and moderators can delete reviews" on public.reviews;
create policy "Authors and moderators can delete reviews"
  on public.reviews for delete to authenticated
  using (
    author_id = (select auth.uid())
    or (select public.is_review_moderator())
  );

create or replace view public.place_review_stats
with (security_invoker = true)
as
  select
    approved_reviews.place_id,
    count(*)::integer as review_count,
    round(avg(approved_reviews.rating)::numeric, 1) as average_rating,
    (
      select latest_review.body
      from public.reviews as latest_review
      where latest_review.place_id = approved_reviews.place_id
        and latest_review.status = 'approved'
      order by latest_review.created_at desc, latest_review.id desc
      limit 1
    ) as latest_review
  from public.reviews as approved_reviews
  where approved_reviews.status = 'approved'
  group by approved_reviews.place_id;

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant select on public.review_moderators to authenticated;
grant select, insert, update, delete on public.places to authenticated;
grant select on public.places to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant select on public.reviews to anon;
grant select on public.place_review_stats to anon, authenticated;
grant execute on function public.is_review_moderator() to anon, authenticated;
