import { requireSupabase } from "./supabase";

const ITEM_COLUMNS =
  "id,title,source,category,section_type,date,week_label,month_label,summary,body,bullets,implication,tags,original_url,importance,is_published,created_at,updated_at";

export function toCamel(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title || "",
    source: row.source || "",
    category: row.category || "",
    sectionType: row.section_type || "일반",
    date: row.date || "",
    weekLabel: row.week_label || "",
    monthLabel: row.month_label || "",
    summary: row.summary || "",
    body: row.body || "",
    bullets: Array.isArray(row.bullets) ? row.bullets : [],
    implication: row.implication || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    originalUrl: row.original_url || "",
    importance: row.importance || "중",
    isPublished: row.is_published ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toSnake(item) {
  return {
    title: item.title,
    source: item.source,
    category: item.category,
    section_type: item.sectionType,
    date: item.date,
    week_label: item.weekLabel,
    month_label: item.monthLabel,
    summary: item.summary,
    body: item.body,
    bullets: item.bullets,
    implication: item.implication,
    tags: item.tags,
    original_url: item.originalUrl,
    importance: item.importance,
    is_published: item.isPublished,
  };
}

export async function getPublishedItems() {
  const { data, error } = await requireSupabase()
    .from("policy_items")
    .select(ITEM_COLUMNS)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toCamel);
}

export async function getAllItemsForAdmin() {
  const { data, error } = await requireSupabase()
    .from("policy_items")
    .select(ITEM_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toCamel);
}

export async function getItemById(id) {
  const { data, error } = await requireSupabase()
    .from("policy_items")
    .select(ITEM_COLUMNS)
    .eq("id", id)
    .single();
  if (error) throw error;
  return toCamel(data);
}

export async function createItem(item) {
  const { error } = await requireSupabase().from("policy_items").insert(toSnake(item));
  if (error) throw error;
}

export async function updateItem(id, item) {
  const { error } = await requireSupabase()
    .from("policy_items")
    .update(toSnake(item))
    .eq("id", id);
  if (error) throw error;
}

export async function deleteItem(id) {
  const { error } = await requireSupabase().from("policy_items").delete().eq("id", id);
  if (error) throw error;
}
