// proxy route to ping frontend -> backend -> db
export async function GET() {
  // gets current System state
  const res = await fetch('http://backend:4000/ping-db');
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
