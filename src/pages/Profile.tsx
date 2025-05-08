
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import ProfileBasicInfo from '@/components/profile/ProfileBasicInfo';
import ProfileSocialLinks from '@/components/profile/ProfileSocialLinks';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  name?: string;
  bio?: string;
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  is_admin?: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    username: '',
    display_name: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile(data as UserProfile);
        } else {
          console.log("No profile found for user:", user.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Check if username is already taken (if changed)
      if (profile.username !== profile.username) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('username')
          .eq('username', profile.username)
          .neq('id', user?.id)
          .single();

        if (existingUser) {
          toast({
            title: 'Error',
            description: 'Username is already taken',
            variant: 'destructive',
          });
          return;
        }
      }

      // Update profile
      const { error } = await supabase
        .from('users')
        .update({
          display_name: profile.display_name,
          name: profile.name,
          bio: profile.bio,
          phone_number: profile.phone_number,
          facebook_url: profile.facebook_url,
          instagram_url: profile.instagram_url,
          youtube_url: profile.youtube_url,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileBasicInfo 
              username={profile.username} 
              displayName={profile.display_name}
              name={profile.name}
              phoneNumber={profile.phone_number}
              bio={profile.bio}
              onFieldChange={handleChange}
            />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect your social media profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSocialLinks
              facebookUrl={profile.facebook_url}
              instagramUrl={profile.instagram_url}
              youtubeUrl={profile.youtube_url}
              onFieldChange={handleChange}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-dictionary-600 hover:bg-dictionary-700"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
