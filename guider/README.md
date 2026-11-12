# No name yet™ (Name to be decided)

AI GUIDANCE FOR PHYSICAL WORK®

Giving Physical Workers AI Superpowers

MVP focus: Facilities, Maintenance & Services (single vertical).

## Run In 5 Minutes

1. Install dependencies

```bash
cd /path/to/project
npm install
```

2. Add Supabase env vars

Create `.env` in project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

3. Start Expo

```bash
npx expo start
```

4. Open on device
- iPhone: scan QR in Expo Go (or run iOS simulator)
- Android: scan QR in Expo Go (or run emulator)

## OpenAI API Key (Required For AI Guidance)

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. In app: `Settings` → `OpenAI API Key`
4. Tap `Paste from Clipboard` → `Save API Key`

Key is saved in secure storage on device.

## Test A Real Session

1. From Home, tap `Start New Session`
2. Allow camera + microphone permissions
3. Point camera at a maintenance target, for example:
- power point
- tap/faucet
- smoke alarm
- AC vent
4. Speak naturally (e.g. "This outlet looks loose, what do I do first?")
5. App will:
- listen continuously
- capture/send a frame every 7 seconds
- speak back one step at a time
- vibrate on AI replies
6. Tap `End Session` (big orange button) to finish and save summary

## Supabase Setup

1. Create Supabase project
2. Enable Auth providers: Google + Apple
3. Add redirect URI: `nonameyet://auth/callback`
4. Run migrations:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

5. Ensure storage bucket exists: `session-photos`

## Troubleshooting

- `No signal? Session saved locally`
: Network dropped. Session is still stored locally and can sync later.

- AI does not respond
: Confirm OpenAI key is saved in Settings and has API billing enabled.

- Camera not visible
: Check app permissions for Camera and Microphone in phone settings.

- Voice replies too fast/slow
: Adjust `Voice speed` in Settings.

- Clipboard paste not working
: Copy key again from OpenAI dashboard, then tap `Paste from Clipboard`.

- OAuth sign-in not working
: Verify Supabase redirect URI exactly matches `nonameyet://auth/callback`.

## Important Files

- `app/session/[id].tsx` (live guidance screen)
- `lib/facilities-prompt.ts` (single source of truth prompt)
- `app/(tabs)/settings.tsx` (API key + voice/camera controls)
- `constants/roles.ts` (single active vertical + locked v2 verticals)
