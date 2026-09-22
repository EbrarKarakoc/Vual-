const FASHN_BASE = "https://api.fashn.ai/v1";

export interface FashnRunRequest {
  model_image: string;
  garment_image: string;
  category?: "tops" | "bottoms" | "one-pieces" | "accessories";
}

export interface FashnRunResponse {
  id: string;
  error?: string;
}

export interface FashnStatusResponse {
  id: string;
  status: "starting" | "in_queue" | "processing" | "completed" | "failed";
  output?: string[];
  error?: string;
}

export async function fashnRun(body: FashnRunRequest): Promise<FashnRunResponse> {
  const res = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: "accessories", ...body }),
  });
  if (!res.ok) throw new Error(`FASHN run failed: ${res.status}`);
  return res.json();
}

export async function fashnStatus(id: string): Promise<FashnStatusResponse> {
  const res = await fetch(`${FASHN_BASE}/status/${id}`, {
    headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`FASHN status failed: ${res.status}`);
  return res.json();
}
