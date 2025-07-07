import { NextResponse } from 'next/server';
import getDb from '../../../lib/dbConnect';

// Create or get profile
export async function POST(request) {
  const db = await getDb();
  const { username } = await request.json();
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Check if profile exists
    const existingProfile = await db.get('SELECT * FROM profiles WHERE username = ?', [username]);
    
    if (existingProfile) {
      return NextResponse.json(existingProfile);
    }

    // Create new profile
    const result = await db.run('INSERT INTO profiles (username) VALUES (?)', [username]);
    const newProfile = await db.get('SELECT * FROM profiles WHERE id = ?', [result.lastID]);
    
    return NextResponse.json(newProfile);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Get all profiles
export async function GET() {
  const db = await getDb();
  
  try {
    const profiles = await db.all('SELECT * FROM profiles ORDER BY created_at DESC');
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 