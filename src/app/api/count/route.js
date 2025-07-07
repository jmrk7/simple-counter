import { NextResponse } from 'next/server';
import getDb from '../../../lib/dbConnect';

// Increment today's count for a profile
export async function POST(request) {
  const db = await getDb();
  const { username } = await request.json();
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Get profile
    const profile = await db.get('SELECT * FROM profiles WHERE username = ?', [username]);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if count exists for today
    let count = await db.get('SELECT * FROM counts WHERE profile_id = ? AND date = ?', [profile.id, today]);
    
    if (!count) {
      // Create new count record
      const result = await db.run(
        'INSERT INTO counts (profile_id, date, value) VALUES (?, ?, 1)',
        [profile.id, today]
      );
      count = await db.get('SELECT * FROM counts WHERE id = ?', [result.lastID]);
    } else {
      // Increment existing count
      await db.run(
        'UPDATE counts SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [count.id]
      );
      count = await db.get('SELECT * FROM counts WHERE id = ?', [count.id]);
    }
    
    return NextResponse.json(count);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Decrement today's count for a profile
export async function PUT(request) {
  const db = await getDb();
  const { username } = await request.json();
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Get profile
    const profile = await db.get('SELECT * FROM profiles WHERE username = ?', [username]);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if count exists for today
    let count = await db.get('SELECT * FROM counts WHERE profile_id = ? AND date = ?', [profile.id, today]);
    
    if (!count) {
      // Create new count record with value 0
      const result = await db.run(
        'INSERT INTO counts (profile_id, date, value) VALUES (?, ?, 0)',
        [profile.id, today]
      );
      count = await db.get('SELECT * FROM counts WHERE id = ?', [result.lastID]);
    } else {
      // Decrement existing count (but not below 0)
      await db.run(
        'UPDATE counts SET value = MAX(0, value - 1), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [count.id]
      );
      count = await db.get('SELECT * FROM counts WHERE id = ?', [count.id]);
    }
    
    return NextResponse.json(count);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Get today's count for a profile
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

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get count for today
    const count = await db.get('SELECT * FROM counts WHERE profile_id = ? AND date = ?', [profile.id, today]);
    
    return NextResponse.json(count || { value: 0 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 