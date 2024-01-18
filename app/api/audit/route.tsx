export async function POST(request: Request) {
    const body = await request.json();
    console.log(body)
    return new Response(JSON.stringify({ ok: true, body: body }), {
        headers: { 'content-type': 'application/json' },
    });
}