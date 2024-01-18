export async function POST(request: Request) {
    const body = await request.json();
    console.log(body)
    return new Response(JSON.stringify(body), {
        headers: { 'content-type': 'application/json' },
    });
}