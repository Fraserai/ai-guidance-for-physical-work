import { SessionMessage, SessionRecord } from '@/types/session';
import { UserProfile } from '@/types/profile';

import { supabase } from '@/lib/supabase';

export function hasSupabase() {
  return Boolean(supabase);
}

export async function upsertUserProfile(userId: string, profile: UserProfile) {
  if (!supabase) {
    return;
  }

  await supabase.from('users').upsert({
    id: userId,
    email: profile.email,
    first_name: profile.firstName,
    role_category_id: profile.roleCategoryId,
    role_category_heading: profile.roleCategoryHeading,
    role_name: profile.roleName,
    custom_role: profile.customRole,
    updated_at: new Date().toISOString()
  });
}

export async function insertSession(session: SessionRecord) {
  if (!supabase) {
    return;
  }

  await supabase.from('sessions').upsert({
    id: session.id,
    user_id: session.userId,
    title: session.title,
    role_category_id: session.roleCategoryId,
    role_category_heading: session.roleCategoryHeading,
    role_name: session.roleName,
    context_note: session.contextNote,
    started_at: session.startedAt,
    ended_at: session.endedAt
  });
}

export async function insertSessionMessage(sessionId: string, userId: string | undefined, message: SessionMessage) {
  if (!supabase) {
    return;
  }

  await supabase.from('session_messages').insert({
    session_id: sessionId,
    user_id: userId,
    role: message.role,
    content: message.content,
    image_storage_path: message.imageStoragePath,
    created_at: message.createdAt
  });
}

export async function uploadSessionPhoto(sessionId: string, imageUri: string) {
  if (!supabase) {
    return undefined;
  }

  const imageResponse = await fetch(imageUri);
  const imageBlob = await imageResponse.blob();
  const imageArrayBuffer = await imageBlob.arrayBuffer();
  const path = `${sessionId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage.from('session-photos').upload(path, imageArrayBuffer, {
    contentType: 'image/jpeg',
    upsert: false
  });

  if (error) {
    throw error;
  }

  return path;
}
