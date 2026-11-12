import { useRouter } from 'expo-router';
import { Check, ChevronDown, ChevronUp, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ACTIVE_VERTICAL,
  ACTIVE_VERTICAL_ID,
  ACTIVE_VERTICAL_ROLES,
  DEFAULT_ACTIVE_ROLE,
  ROLE_CATEGORIES
} from '@/constants/roles';
import { upsertUserProfile } from '@/lib/supabase-repo';
import { useAuthStore } from '@/store/auth-store';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const initialRole =
    profile?.roleCategoryId === ACTIVE_VERTICAL_ID && profile?.roleName
      ? profile.roleName
      : DEFAULT_ACTIVE_ROLE;

  const [expandedCategoryId, setExpandedCategoryId] = useState<string>(ACTIVE_VERTICAL_ID);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ACTIVE_VERTICAL_ID);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [customRole, setCustomRole] = useState(profile?.customRole ?? '');
  const [saving, setSaving] = useState(false);

  const canSave = Boolean(selectedRole || customRole.trim());

  const saveRoleSelection = async () => {
    if (!userId || !canSave) {
      return;
    }

    setSaving(true);

    const roleName = customRole.trim() || selectedRole || DEFAULT_ACTIVE_ROLE;
    const roleHeading = ACTIVE_VERTICAL.heading;

    setProfile({
      roleCategoryId: ACTIVE_VERTICAL_ID,
      roleCategoryHeading: roleHeading,
      roleName,
      customRole: customRole.trim() || undefined,
      firstName: profile?.firstName || 'Caesey'
    });

    try {
      await upsertUserProfile(userId, {
        id: userId,
        email: profile?.email,
        firstName: profile?.firstName || 'Caesey',
        roleCategoryId: ACTIVE_VERTICAL_ID,
        roleCategoryHeading: roleHeading,
        roleName,
        customRole: customRole.trim() || undefined
      });
    } catch {
      // Local profile is already updated. Remote sync can happen later.
    } finally {
      setSaving(false);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-4">
      <View className="pb-4 pt-2">
        <Text className="text-lg font-black text-white">No name yet™ (Name to be decided)</Text>
        <Text className="mt-1 text-xs font-semibold tracking-wide text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
        <Text className="text-2xl font-bold text-white">Choose your role</Text>
        <Text className="mt-2 text-sm text-muted">
          MVP is focused on Facilities, Maintenance & Services. Other verticals are visible and locked for now.
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="gap-3 pb-8">
          {ROLE_CATEGORIES.map((category) => {
            const expanded = expandedCategoryId === category.id;
            const selected = selectedCategoryId === category.id;
            const locked = !category.active;

            return (
              <View
                key={category.id}
                className={
                  locked
                    ? 'overflow-hidden rounded-2xl border border-border/60 bg-panel/60'
                    : 'overflow-hidden rounded-2xl border border-safety/50 bg-panel'
                }
              >
                <Pressable
                  className="min-h-[60px] flex-row items-center justify-between px-4 py-3"
                  onPress={() => setExpandedCategoryId(expanded ? '' : category.id)}
                >
                  <View className="flex-1 pr-3">
                    <Text className={locked ? 'text-base font-semibold text-muted' : 'text-base font-semibold text-white'}>
                      {category.emoji} {category.heading}
                    </Text>
                    {category.subtitle ? (
                      <Text className={locked ? 'mt-1 text-xs text-muted/70' : 'mt-1 text-xs text-muted'}>{category.subtitle}</Text>
                    ) : null}
                    {locked ? (
                      <View className="mt-2 flex-row items-center gap-1">
                        <Lock size={13} color="#FF6200" />
                        <Text className="text-xs font-semibold text-safety">{category.lockedLabel}</Text>
                      </View>
                    ) : null}
                  </View>

                  {expanded ? <ChevronUp size={18} color="#AAB6C5" /> : <ChevronDown size={18} color="#AAB6C5" />}
                </Pressable>

                {expanded ? (
                  <View className="border-t border-border px-4 pb-4 pt-2">
                    {category.groups.map((group) => (
                      <View key={group.name} className="mb-3">
                        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{group.name}</Text>
                        <View className="gap-2">
                          {group.roles.map((role) => {
                            const roleSelected = selected && selectedRole === role;
                            const roleIsActiveOption = category.active && ACTIVE_VERTICAL_ROLES.includes(role);

                            return (
                              <Pressable
                                key={role}
                                disabled={!roleIsActiveOption}
                                className={
                                  roleSelected
                                    ? 'min-h-[60px] flex-row items-center justify-between rounded-xl border border-safety bg-safety/15 px-3 py-3'
                                    : roleIsActiveOption
                                      ? 'min-h-[60px] flex-row items-center justify-between rounded-xl border border-border bg-panelSoft px-3 py-3'
                                      : 'min-h-[60px] flex-row items-center justify-between rounded-xl border border-border/60 bg-panelSoft/50 px-3 py-3'
                                }
                                onPress={() => {
                                  if (!roleIsActiveOption) {
                                    return;
                                  }

                                  setSelectedCategoryId(category.id);
                                  setSelectedRole(role);
                                }}
                              >
                                <Text className={roleIsActiveOption ? 'flex-1 text-sm text-white' : 'flex-1 text-sm text-muted'}>{role}</Text>
                                {roleSelected ? <Check size={18} color="#FF6200" /> : null}
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}

          <View className="rounded-2xl border border-border bg-panel p-4">
            <Text className="mb-2 text-sm font-semibold text-white">Custom Role (Facilities only)</Text>
            <Input
              placeholder="Example: Maintenance Officer"
              value={customRole}
              onChangeText={setCustomRole}
              autoCapitalize="words"
            />
            <Text className="mt-2 text-xs text-muted">Keep it within facilities and property maintenance scope for this MVP.</Text>
          </View>
        </View>
      </ScrollView>

      <View className="pb-4 pt-2">
        <Button
          label={saving ? 'Saving...' : 'Save Role & Continue'}
          disabled={!canSave || saving}
          onPress={() => void saveRoleSelection()}
        />
      </View>
    </SafeAreaView>
  );
}
