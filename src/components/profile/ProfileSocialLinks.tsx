
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileSocialLinksProps {
  facebookUrl: string | undefined;
  instagramUrl: string | undefined;
  youtubeUrl: string | undefined;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSocialLinks = ({
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  onFieldChange,
}: ProfileSocialLinksProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="facebook_url">Facebook URL (Optional)</Label>
        <Input
          id="facebook_url"
          name="facebook_url"
          value={facebookUrl || ''}
          onChange={onFieldChange}
          placeholder="https://facebook.com/yourusername"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram_url">Instagram URL (Optional)</Label>
        <Input
          id="instagram_url"
          name="instagram_url"
          value={instagramUrl || ''}
          onChange={onFieldChange}
          placeholder="https://instagram.com/yourusername"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube_url">YouTube URL (Optional)</Label>
        <Input
          id="youtube_url"
          name="youtube_url"
          value={youtubeUrl || ''}
          onChange={onFieldChange}
          placeholder="https://youtube.com/@yourchannel"
        />
      </div>
    </div>
  );
};

export default ProfileSocialLinks;
