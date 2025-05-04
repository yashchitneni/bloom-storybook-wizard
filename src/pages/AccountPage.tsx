
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getFileUrl } from '@/utils/storage-utils';

interface Storybook {
  id: string;
  theme: string;
  subject: string;
  age_category: string;
  created_at: string;
  status: string;
  pdf_url: string | null;
  photo_url: string | null;
}

const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [storybooks, setStorybooks] = useState<Storybook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user && !localStorage.getItem('supabase.auth.token')) {
      navigate('/auth');
      return;
    }

    const fetchStorybooks = async () => {
      try {
        const { data, error } = await supabase
          .from('storybooks')
          .select('*')
          .eq('author_id', user?.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching storybooks:", error);
          return;
        }
        
        setStorybooks(data || []);
      } catch (err) {
        console.error("Error in storybooks fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchStorybooks();
    }
  }, [user, navigate]);
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'Processing';
      case 'completed': return 'Ready';
      case 'failed': return 'Error';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-select">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">My Storybooks</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persimmon"></div>
            </div>
          ) : storybooks.length === 0 ? (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-bold mb-4">No storybooks yet</h3>
              <p className="mb-6">Create your first personalized storybook to get started!</p>
              <Button onClick={() => navigate('/wizard')}>Create Storybook</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storybooks.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-40 bg-mint/20 relative">
                    {book.photo_url && (
                      <img 
                        src={getFileUrl(book.photo_url) || undefined}
                        alt={book.subject} 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status)}`}>
                        {getStatusLabel(book.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate">{book.subject}</h3>
                    <p className="text-sm text-gray-600">
                      {book.theme} • Age {book.age_category}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created on {formatDate(book.created_at)}
                    </p>
                    <div className="mt-4">
                      <Button 
                        onClick={() => navigate(`/story/${book.id}`)} 
                        size="sm"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;

const Button = ({ 
  children, 
  onClick, 
  size = 'md',
  className = ''
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-6',
    lg: 'py-3 px-8 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      className={`bg-persimmon text-white hover:bg-opacity-90 transition-colors font-bold rounded-full ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
