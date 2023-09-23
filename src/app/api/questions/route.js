// http://localhost:3000/api/questions

// Create
export async function POST(request) {
  return new Response('Created guestion');
}

// Read
export async function GET(request) {
  return new Response('Read guestion');
}

// Update
export async function PUT(request) {
  return new Response('Updated guestion');
}

// Delete
export async function GET(request) {
  return new Response('Deleted guestion');
}

