create or replace function public.slugify_noticia_title(value text)
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(
      trim(
        both '-'
        from regexp_replace(
          lower(
            translate(
              coalesce(value, ''),
              'áàäâãåéèëêíìïîóòöôõúùüûñç',
              'aaaaaaeeeeiiiiooooouuuunc'
            )
          ),
          '[^a-z0-9]+',
          '-',
          'g'
        )
      ),
      ''
    ),
    'noticia'
  );
$$;

alter table public.noticias
add column if not exists slug text;

with ranked_titles as (
  select
    id,
    public.slugify_noticia_title(titulo) as base_slug,
    row_number() over (
      partition by public.slugify_noticia_title(titulo)
      order by fecha desc, created_at desc, id asc
    ) as duplicate_index
  from public.noticias
  where slug is null or btrim(slug) = ''
)
update public.noticias as noticias
set slug = case
  when ranked_titles.duplicate_index = 1 then ranked_titles.base_slug
  else ranked_titles.base_slug || '-' || ranked_titles.duplicate_index
end
from ranked_titles
where noticias.id = ranked_titles.id;

alter table public.noticias
alter column slug set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'noticias_slug_key'
  ) then
    alter table public.noticias
    add constraint noticias_slug_key unique (slug);
  end if;
end;
$$;
