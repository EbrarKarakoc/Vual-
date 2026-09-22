export async function moderateImage(imageUrl: string) {
  const key = process.env.CLARIFAI_API_KEY;
  const model = process.env.CLARIFAI_MODEL_ID ?? "moderation";
  if (!key) throw new Error("CLARIFAI_API_KEY not set");

  const body = {
    inputs: [
      {
        data: {
          image: { url: imageUrl },
        },
      },
    ],
  };

  const res = await fetch(`https://api.clarifai.com/v2/models/${model}/outputs`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Clarifai error ${res.status}: ${txt}`);
  }

  const json = await res.json();
  return json;
}

export default moderateImage;
