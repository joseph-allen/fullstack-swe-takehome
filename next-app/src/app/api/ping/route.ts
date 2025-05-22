// proxy route to avoid CORS issues
export async function GET() {
  const res = await fetch('http://backend:4000/ping-db');
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
