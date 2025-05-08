import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  File,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  username: string;
  display_name: string;
  is_admin: boolean;
}

interface DictionaryEntry {
  id: string;
  word: string;
  part_of_speech: string;
  created_by: string;
  created_at: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<string>('username');
  
  useEffect(() => {
    // Check if user is admin
    if (!user || !userProfile?.is_admin) {
      toast({
        title: 'Access denied',
        description: 'You do not have permission to access the admin dashboard',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
    
    fetchData(activeTab);
  }, [user, userProfile, activeTab, navigate]);
  
  const fetchData = async (tab: string) => {
    setIsLoading(true);
    try {
      if (tab === 'users') {
        await fetchUsers();
      } else if (tab === 'entries') {
        await fetchEntries();
      } else if (tab === 'pages') {
        await fetchPages();
      }
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, is_admin')
      .order(sortField, { ascending: sortOrder === 'asc' });
      
    if (error) throw error;
    setUsers(data as User[]);
  };
  
  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .select('id, word, part_of_speech, created_by, created_at')
      .order(sortField, { ascending: sortOrder === 'asc' });
      
    if (error) throw error;
    setEntries(data as DictionaryEntry[]);
  };
  
  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('id, title, slug, updated_at')
      .order(sortField, { ascending: sortOrder === 'asc' });
      
    if (error) throw error;
    setPages(data as Page[]);
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  useEffect(() => {
    if (!isLoading) {
      fetchData(activeTab);
    }
  }, [sortField, sortOrder]);
  
  const toggleUserAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_admin: !currentStatus } : u
      ));
      
      toast({
        title: 'Success',
        description: `User admin status updated successfully`,
      });
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user admin status',
        variant: 'destructive',
      });
    }
  };
  
  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('dictionary_entries')
        .delete()
        .eq('id', entryId);
        
      if (error) throw error;
      
      // Update local state
      setEntries(entries.filter(e => e.id !== entryId));
      
      toast({
        title: 'Success',
        description: 'Dictionary entry deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEntries = entries.filter(entry => 
    entry.word.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderSortIndicator = (field: string) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />;
    }
    return null;
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setSearchQuery('');
        if (value === 'users') {
          setSortField('username');
        } else if (value === 'entries') {
          setSortField('word');
        } else {
          setSortField('title');
        }
        setSortOrder('asc');
      }}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center">
            <File className="w-4 h-4 mr-2" />
            Dictionary Entries
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center">
            <File className="w-4 h-4 mr-2" />
            Content Pages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>Manage user accounts and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('username')}
                        >
                          Username {renderSortIndicator('username')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('display_name')}
                        >
                          Display Name {renderSortIndicator('display_name')}
                        </TableHead>
                        <TableHead>Admin Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.display_name}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.is_admin ? 'Admin' : 'User'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => toggleUserAdmin(user.id, user.is_admin)}>
                                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/admin/users/${user.id}`}>
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            {searchQuery ? 'No users found matching your search' : 'No users found'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>Dictionary Entries</CardTitle>
              <CardDescription>Manage all dictionary entries.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading entries...</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('word')}
                        >
                          Word {renderSortIndicator('word')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('part_of_speech')}
                        >
                          Part of Speech {renderSortIndicator('part_of_speech')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('created_at')}
                        >
                          Created At {renderSortIndicator('created_at')}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.length > 0 ? (
                        filteredEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.word}</TableCell>
                            <TableCell>{entry.part_of_speech}</TableCell>
                            <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/dictionary/${entry.id}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/dictionary/edit/${entry.id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the entry "{entry.word}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteEntry(entry.id)}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            {searchQuery ? 'No entries found matching your search' : 'No entries found'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Content Pages</CardTitle>
              <CardDescription>Manage editable content pages.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading pages...</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('title')}
                        >
                          Title {renderSortIndicator('title')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('slug')}
                        >
                          Slug {renderSortIndicator('slug')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('updated_at')}
                        >
                          Last Updated {renderSortIndicator('updated_at')}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPages.length > 0 ? (
                        filteredPages.map((page) => (
                          <TableRow key={page.id}>
                            <TableCell className="font-medium">{page.title}</TableCell>
                            <TableCell>{page.slug}</TableCell>
                            <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/${page.slug}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/${page.slug}`)}
                                  className="flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            {searchQuery ? 'No pages found matching your search' : 'No content pages found'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
