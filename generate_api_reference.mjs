import { readFileSync, writeFileSync } from "fs";

const OPENAPI_PATH = "./openapi.json";
const OUTPUT_PATH = "./BACKEND_API_REFERENCE.md";

function resolveRef(spec, ref) {
  if (!ref || !ref.startsWith("#/")) return null;
  const parts = ref.slice(2).split("/");
  let cur = spec;
  for (const p of parts) cur = cur?.[p];
  return cur ?? null;
}

function schemaToText(schema, spec) {
  if (!schema) return "N/A";
  if (schema.$ref) return `ref: \`${schema.$ref}\``;
  if (schema.type === "array") {
    const itemText = schemaToText(schema.items, spec);
    return `array<${itemText.replace(/^ref:\s*/, "")}>`;
  }
  if (schema.oneOf?.length) {
    return `oneOf(${schema.oneOf.map((s) => schemaToText(s, spec)).join(" | ")})`;
  }
  if (schema.anyOf?.length) {
    return `anyOf(${schema.anyOf.map((s) => schemaToText(s, spec)).join(" | ")})`;
  }
  if (schema.allOf?.length) {
    return `allOf(${schema.allOf.map((s) => schemaToText(s, spec)).join(" + ")})`;
  }
  if (schema.type) return schema.type;
  return "object";
}

function getRequestBodyInfo(requestBody, spec) {
  if (!requestBody) return null;
  const rb = requestBody.$ref ? resolveRef(spec, requestBody.$ref) : requestBody;
  if (!rb) return null;
  const content = rb.content || {};
  const entries = Object.entries(content);
  if (entries.length === 0) {
    return { required: !!rb.required, media: "N/A", schema: "N/A", description: rb.description || "" };
  }
  return entries.map(([mediaType, media]) => ({
    required: !!rb.required,
    media: mediaType,
    schema: schemaToText(media?.schema, spec),
    description: rb.description || "",
  }));
}

function normalizeParameters(opParams, pathParams, spec) {
  const raw = [...(pathParams || []), ...(opParams || [])];
  return raw.map((p) => {
    const prm = p.$ref ? resolveRef(spec, p.$ref) : p;
    return {
      name: prm?.name || "unknown",
      in: prm?.in || "unknown",
      required: !!prm?.required,
      schema: schemaToText(prm?.schema, spec),
      description: prm?.description || "",
    };
  });
}

function getResponseInfo(responses, spec) {
  const items = [];
  const keys = Object.keys(responses || {}).sort((a, b) => {
    const ai = Number(a);
    const bi = Number(b);
    if (!Number.isNaN(ai) && !Number.isNaN(bi)) return ai - bi;
    return a.localeCompare(b);
  });

  keys.forEach((code) => {
    const resp = responses[code];
    const r = resp?.$ref ? resolveRef(spec, resp.$ref) : resp;
    const desc = r?.description || "";
    const content = r?.content || {};
    const contentEntries = Object.entries(content);

    if (contentEntries.length === 0) {
      items.push({ code, media: "N/A", schema: "N/A", description: desc });
      return;
    }

    contentEntries.forEach(([media, val]) => {
      items.push({
        code,
        media,
        schema: schemaToText(val?.schema, spec),
        description: desc,
      });
    });
  });

  return items;
}

const spec = JSON.parse(readFileSync(OPENAPI_PATH, "utf8"));
const methods = ["get", "post", "put", "patch", "delete", "options", "head"];
const pathEntries = Object.entries(spec.paths || {}).sort((a, b) => a[0].localeCompare(b[0]));

let md = "";
md += "# Backend API Reference\n\n";
md += `Generated from \`${OPENAPI_PATH}\`.\n\n`;
md += `- OpenAPI title: **${spec.info?.title || "N/A"}**\n`;
md += `- Version: **${spec.info?.version || "N/A"}**\n`;
md += `- Total paths: **${pathEntries.length}**\n`;

const allOps = [];
pathEntries.forEach(([path, item]) => {
  methods.forEach((m) => {
    if (item[m]) allOps.push({ path, method: m.toUpperCase(), op: item[m], pathItem: item });
  });
});
md += `- Total operations: **${allOps.length}**\n\n`;

md += "## Quick Index\n\n";
allOps.forEach((x, idx) => {
  const opId = x.op.operationId || `${x.method.toLowerCase()}-${idx + 1}`;
  md += `${idx + 1}. \`${x.method}\` \`${x.path}\` - \`${opId}\`\n`;
});
md += "\n";

md += "## Full API Details\n\n";

allOps.forEach((x, idx) => {
  const { path, method, op, pathItem } = x;
  const title = `${method} ${path}`;
  const operationId = op.operationId || `operation_${idx + 1}`;
  const summary = op.summary || "";
  const description = op.description || "";
  const tags = op.tags || [];
  const params = normalizeParameters(op.parameters, pathItem.parameters, spec);
  const requestBodies = getRequestBodyInfo(op.requestBody, spec);
  const responses = getResponseInfo(op.responses, spec);

  md += `### ${title}\n\n`;
  md += `- OperationId: \`${operationId}\`\n`;
  if (tags.length) md += `- Tags: ${tags.map((t) => `\`${t}\``).join(", ")}\n`;
  if (summary) md += `- Summary: ${summary}\n`;
  if (description) md += `- Description: ${description.replace(/\n+/g, " ")}\n`;
  md += "\n";

  md += "#### Parameters\n\n";
  if (params.length === 0) {
    md += "_None_\n\n";
  } else {
    md += "| Name | In | Required | Type/Schema | Description |\n";
    md += "|---|---|---|---|---|\n";
    params.forEach((p) => {
      const desc = (p.description || "").replace(/\|/g, "\\|").replace(/\n+/g, " ");
      md += `| \`${p.name}\` | \`${p.in}\` | ${p.required ? "Yes" : "No"} | ${p.schema} | ${desc} |\n`;
    });
    md += "\n";
  }

  md += "#### Request Body\n\n";
  if (!requestBodies) {
    md += "_None_\n\n";
  } else {
    const list = Array.isArray(requestBodies) ? requestBodies : [requestBodies];
    md += "| Required | Content-Type | Schema | Description |\n";
    md += "|---|---|---|---|\n";
    list.forEach((rb) => {
      const desc = (rb.description || "").replace(/\|/g, "\\|").replace(/\n+/g, " ");
      md += `| ${rb.required ? "Yes" : "No"} | \`${rb.media}\` | ${rb.schema} | ${desc} |\n`;
    });
    md += "\n";
  }

  md += "#### Responses\n\n";
  if (responses.length === 0) {
    md += "_None_\n\n";
  } else {
    md += "| Status | Content-Type | Schema | Description |\n";
    md += "|---|---|---|---|\n";
    responses.forEach((r) => {
      const desc = (r.description || "").replace(/\|/g, "\\|").replace(/\n+/g, " ");
      md += `| \`${r.code}\` | \`${r.media}\` | ${r.schema} | ${desc} |\n`;
    });
    md += "\n";
  }

  md += "---\n\n";
});

writeFileSync(OUTPUT_PATH, md, "utf8");
console.log(`Generated ${OUTPUT_PATH}`);
console.log(`Operations documented: ${allOps.length}`);
