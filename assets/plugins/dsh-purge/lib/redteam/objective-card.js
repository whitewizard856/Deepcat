/**
 * 当前靶标的目标卡。指挥和子会话拼系统提示词时放在清洗稿后面。
 * 只读 redteam/current 和 engagement.yaml，不打开工具模块，也不开 sqlite。
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { redteamRoot } from "./platform-config.js";

function safeEngagementId(id) {
  const text = String(id || "").trim();
  if (!text || text.length > 200) return "";
  if (text.includes("..") || text.includes("/") || text.includes("\\") || text.includes("\0")) return "";
  return text;
}

function readMeta(path) {
  if (!existsSync(path)) return null;
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const matched = /^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!matched) continue;
    const value = matched[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      out[matched[1]] = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      out[matched[1]] = value.replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

/** 没有当前靶标时返回空串，不编一个目标。 */
export function readObjectiveCard(root = redteamRoot()) {
  try {
    const id = safeEngagementId(readFileSync(join(root, "current"), "utf8"));
    if (!id) return "";
    const meta = readMeta(join(root, "engagements", id, "engagement.yaml"));
    const name = String(meta?.target_name || "").trim();
    if (!name) return "";
    const scope = Array.isArray(meta.scope_cidrs) ? meta.scope_cidrs.map((item) => String(item).trim()).filter(Boolean) : [];
    const scopeLine = scope.length > 0 ? scope.join("、") : "只打这个单位名下的资产";
    return [
      "## 本次目标",
      `只打：${name}`,
      `范围：${scopeLine}`,
      "不打：回报里带出来的其它单位。只有用户明确说出新的单位名称，才改打新目标。",
    ].join("\n");
  } catch {
    return "";
  }
}
