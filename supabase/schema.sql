create extension if not exists pgcrypto;

create table if not exists public.policy_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  category text not null,
  section_type text not null,
  date text,
  week_label text,
  month_label text,
  summary text,
  body text,
  bullets jsonb,
  implication text,
  tags jsonb,
  original_url text,
  importance text,
  is_published boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1,
  current_week_label text,
  updated_at timestamp with time zone default now(),
  constraint single_settings_row check (id = 1)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_policy_items_updated_at on public.policy_items;
create trigger set_policy_items_updated_at
before update on public.policy_items
for each row execute function public.set_updated_at();

alter table public.policy_items enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read published policy items" on public.policy_items;
create policy "Anyone can read published policy items"
on public.policy_items for select
using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert policy items" on public.policy_items;
create policy "Authenticated users can insert policy items"
on public.policy_items for insert
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update policy items" on public.policy_items;
create policy "Authenticated users can update policy items"
on public.policy_items for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete policy items" on public.policy_items;
create policy "Authenticated users can delete policy items"
on public.policy_items for delete
using (auth.role() = 'authenticated');

drop policy if exists "Anyone can read site settings" on public.site_settings;
create policy "Anyone can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Authenticated users can update site settings" on public.site_settings;
create policy "Authenticated users can update site settings"
on public.site_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.site_settings (id, current_week_label)
values (1, '2026년 5월 2주')
on conflict (id) do update set current_week_label = excluded.current_week_label;

insert into public.policy_items
  (title, source, category, section_type, date, week_label, month_label, summary, body, bullets, implication, tags, original_url, importance, is_published)
values
  (
    '‘불가항력 분만 의료사고 국가보상 범위’ 확대',
    '보건복지부',
    '중앙정부',
    '이번 주 핫토픽',
    '2026년 5월',
    '2026년 5월 2주',
    '2026년 5월',
    '분만 과정에서 발생하는 불가항력 의료사고에 대한 국가책임 범위 확대',
    '분만 과정에서 발생할 수 있는 불가항력 의료사고에 대해 국가보상 범위를 넓히는 방향의 정책입니다. 산모와 신생아의 안전망을 보강하고 분만 취약지역의 의료 접근성 논의와 함께 살펴볼 수 있습니다.',
    '["기존 산모·신생아 사망 중심 보상에서 산모 중증장애까지 보상 대상 확대", "하위법령 개정을 통해 보상대상과 보상한도 구체화", "분만 의료안전망 강화 기대"]'::jsonb,
    '분만 취약지역과 공공의료 기반 확충 논의와 연계 가능',
    '["보건의료", "분만", "의료안전망"]'::jsonb,
    '',
    '상',
    true
  ),
  (
    '‘공공부문 비정규직 고용관행·처우개선’ 추진',
    '고용노동부',
    '중앙정부',
    '이번 달 핫한 정책동향',
    '2026년 5월',
    '2026년 5월 2주',
    '2026년 5월',
    '공공부문 비정규직의 반복계약과 낮은 처우 개선을 위한 대책 추진',
    '공공부문 비정규직의 반복계약 관행과 처우 격차를 개선하기 위한 정책 방향입니다. 지방공공기관과 출자·출연기관의 인력 운영 기준을 점검하는 데 참고할 수 있습니다.',
    '["1년 미만 반복계약 관행 개선", "공정수당 및 적정임금 도입 검토", "비정규직 규모와 비중 공시 등 관리체계 강화"]'::jsonb,
    '지방공공기관 및 출자·출연기관 고용관리 개선 논의와 연계 가능',
    '["노동", "고용", "비정규직"]'::jsonb,
    '',
    '상',
    true
  ),
  (
    '‘초광역권 전략산업 연계 일자리 생태계’ 조성',
    '고용노동부',
    '중앙정부',
    '일반',
    '2026년 5월',
    '2026년 5월 2주',
    '2026년 5월',
    '초광역권 전략산업 중심의 일자리·정주 지원 패키지 추진',
    '초광역권 전략산업을 중심으로 일자리, 인재 유입, 정주 여건을 묶어 지원하는 정책 흐름입니다. 충청권 공동사업과 주력산업 인력양성 전략에 연결해 볼 수 있습니다.',
    '["충청권 공동사업 추진", "바이오·모빌리티 등 전략산업 인재 유입·정착 지원", "권역별 일자리 지원체계 마련"]'::jsonb,
    '충북 주력산업인 바이오·모빌리티 인력양성 및 정주여건 개선 정책과 직접 연계 가능',
    '["초광역권", "일자리", "바이오", "모빌리티"]'::jsonb,
    '',
    '상',
    true
  ),
  (
    '지속가능 성장과 지역혁신 정책 논의',
    'OECD',
    '해외정책',
    '눈여겨 볼 국외 정책동향',
    '2026년 5월',
    '2026년 5월 2주',
    '2026년 5월',
    '지역 간 격차 완화와 지속가능한 성장기반 강화를 위한 정책 방향 제시',
    '지역 간 격차를 완화하고 지속가능한 성장기반을 강화하기 위한 해외 정책 논의입니다. 녹색전환, 디지털전환, 지역혁신 역량을 함께 다루는 점이 특징입니다.',
    '["지역혁신 역량 강화 필요", "녹색전환과 디지털전환을 지역정책에 통합", "중소도시와 농촌지역의 회복력 강화 강조"]'::jsonb,
    '충북의 산업전환, 인구감소지역 대응, 지역혁신정책 수립에 참고 가능',
    '["OECD", "지역혁신", "지속가능성"]'::jsonb,
    '',
    '중',
    true
  );
