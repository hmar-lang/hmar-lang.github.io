
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileBasicInfoProps {
  username: string;
  displayName: string;
  name: string | undefined;
  phoneNumber: string | undefined;
  bio: string | undefined;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileBasicInfo = ({
  username,
  displayName,
  name,
  phoneNumber,
  bio,
  onFieldChange,
}: ProfileBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={onFieldChange}
            disabled
          />
          <p className="text-xs text-gray-500">Username cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            name="display_name"
            value={displayName}
            onChange={onFieldChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name (Optional)</Label>
          <Input
            id="name"
            name="name"
            value={name || ''}
            onChange={onFieldChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number (Optional)</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={phoneNumber || ''}
            onChange={onFieldChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          name="bio"
          value={bio || ''}
          onChange={onFieldChange}
          rows={4}
          placeholder="Tell us a bit about yourself"
        />
      </div>
    </div>
  );
};

export default ProfileBasicInfo;
