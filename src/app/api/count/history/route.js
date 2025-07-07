import { NextResponse } from 'next/server';
import getDb from '../../../../lib/dbConnect';

// Get count history for a profile
export async function GET(request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Get profile
    const profile = await db.get('SELECT * FROM profiles WHERE username = ?', [username]);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all counts for this profile, ordered by date
    const counts = await db.all(
      'SELECT * FROM counts WHERE profile_id = ? ORDER BY date ASC',
      [profile.id]
    );
    
    return NextResponse.json(counts);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 