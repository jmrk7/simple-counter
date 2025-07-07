import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Count from '../../../../lib/models/Count';
import Profile from '../../../../lib/models/Profile';

// Get count history for a profile
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
  const counts = await Count.find({ profile: profile._id }).sort({ date: 1 });
  return NextResponse.json(counts);
} 