import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Count from '../../../lib/models/Count';
import Profile from '../../../lib/models/Profile';

// Helper function to get current date in CST
function getCurrentDateInCST() {
  const now = new Date();
  // Convert to CST (UTC-6 for standard time, UTC-5 for daylight time)
  // For simplicity, using UTC-6 (Central Standard Time)
  const cstOffset = -6 * 60; // 6 hours in minutes
  const cstTime = new Date(now.getTime() + (cstOffset * 60 * 1000));
  
  // Set to start of day (midnight) in CST
  cstTime.setHours(0, 0, 0, 0);
  return cstTime;
}

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
  const today = getCurrentDateInCST();
  let count = await Count.findOne({ profile: profile._id, date: today });
  if (!count) {
    count = await Count.create({ profile: profile._id, date: today, value: 1 });
  } else {
    count.value += 1;
    await count.save();
  }
  return NextResponse.json(count);
}

// Decrement today's count for a profile
export async function PUT(request) {
  await dbConnect();
  const { username } = await request.json();
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }
  const profile = await Profile.findOne({ username });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  const today = getCurrentDateInCST();
  let count = await Count.findOne({ profile: profile._id, date: today });
  if (!count) {
    count = await Count.create({ profile: profile._id, date: today, value: 0 });
  } else {
    count.value = Math.max(0, count.value - 1);
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
  const today = getCurrentDateInCST();
  const count = await Count.findOne({ profile: profile._id, date: today });
  return NextResponse.json(count || { value: 0 });
} 