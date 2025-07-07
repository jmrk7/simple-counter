import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Count from '../../../lib/models/Count';
import Profile from '../../../lib/models/Profile';

// Increment today's count for a profile
export async function POST(request) {
  await dbConnect();
  const { username } = await request.json();
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }
  const profile = await Profile.findOne({ username });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let count = await Count.findOne({ profile: profile._id, date: today });
  if (!count) {
    count = await Count.create({ profile: profile._id, date: today, value: 1 });
  } else {
    count.value += 1;
    await count.save();
  }
  return NextResponse.json(count);
}

// Get today's count for a profile
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }
  const profile = await Profile.findOne({ username });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await Count.findOne({ profile: profile._id, date: today });
  return NextResponse.json(count || { value: 0 });
} 