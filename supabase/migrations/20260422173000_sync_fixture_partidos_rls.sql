do $$
begin
  if to_regclass('public.fixture_partidos') is null then
    raise notice 'public.fixture_partidos no existe; se omite la configuracion RLS del fixture.';
    return;
  end if;

  execute 'alter table public.fixture_partidos enable row level security';
  execute 'grant select, insert, update, delete on table public.fixture_partidos to anon, authenticated';

  if to_regclass('public.fixture_partidos_id_seq') is not null then
    execute 'grant usage, select on sequence public.fixture_partidos_id_seq to anon, authenticated';
  end if;

  execute 'drop policy if exists "Public can read fixture_partidos" on public.fixture_partidos';
  execute '
    create policy "Public can read fixture_partidos"
    on public.fixture_partidos
    for select
    to public
    using (true)
  ';

  execute 'drop policy if exists "Anon can insert fixture_partidos" on public.fixture_partidos';
  execute '
    create policy "Anon can insert fixture_partidos"
    on public.fixture_partidos
    for insert
    to anon
    with check (true)
  ';

  execute 'drop policy if exists "Anon can update fixture_partidos" on public.fixture_partidos';
  execute '
    create policy "Anon can update fixture_partidos"
    on public.fixture_partidos
    for update
    to anon
    using (true)
    with check (true)
  ';

  execute 'drop policy if exists "Anon can delete fixture_partidos" on public.fixture_partidos';
  execute '
    create policy "Anon can delete fixture_partidos"
    on public.fixture_partidos
    for delete
    to anon
    using (true)
  ';
end;
$$;
