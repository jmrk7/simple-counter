import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Profile from '../../../lib/models/Profile';

// Create or get profile
export async function POST(request) {
  await dbConnect();
  const { username } = await request.json();
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }
  let profile = await Profile.findOne({ username });
  if (!profile) {
    profile = await Profile.create({ username });
  }
  return NextResponse.json(profile);
}

// Get all profiles
export async function GET() {
  await dbConnect();
  const profiles = await Profile.find();
  return NextResponse.json(profiles);
} 