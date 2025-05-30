import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getFileUrl } from '@/utils/storage-utils';
import { PlusCircle, Download, Book } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Storybook } from '@/types/wizard';

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
          .select('*') // Select all columns to avoid missing fields
          .eq('author_id', user?.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching storybooks:", error);
          toast({
            title: "Error fetching storybooks",
            description: "We couldn't load your storybooks. Please try again later.",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          // Process the data to ensure each storybook has all the expected properties
          const processedData = data.map(book => ({
            id: book.id || '',
            author_id: book.author_id,
            theme: book.theme || '',
            subject: book.subject || '',
            message: book.message || '',
            custom_note: book.custom_note,
            age_category: book.age_category || '',
            style: book.style || '',
            child_name: book.child_name || 'Your Child',
            child_gender: book.child_gender || '',
            child_photo_url: book.child_photo_url || null,
            status: book.status || 'draft',
            pdf_url: book.pdf_url,
            photo_url: book.photo_url,
            created_at: book.created_at || new Date().toISOString(),
            email: book.email || ''
          }));
          setStorybooks(processedData);
        }
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
      case 'draft': return 'Draft';
      case 'generating': return 'Generating';
      case 'complete': return 'Complete';
      case 'error': return 'Error';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'complete': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getBookTitle = (book: Storybook) => {
    return `${book.child_name}'s ${book.theme} Story`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-select">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">My Storybooks</h1>
            <Button 
              onClick={() => navigate('/wizard')}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create a New Book
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persimmon"></div>
            </div>
          ) : storybooks.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="mx-auto mb-4 bg-mint/20 h-24 w-24 flex items-center justify-center rounded-full">
                <Book className="h-12 w-12 text-persimmon" />
              </div>
              <h3 className="text-xl font-bold mb-4">No storybooks yet</h3>
              <p className="mb-6 text-gray-600">Create your first personalized storybook to get started!</p>
              <Button onClick={() => navigate('/wizard')}>Create Storybook</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storybooks.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
                  <div className="h-48 bg-mint/20 relative">
                    {book.photo_url ? (
                      <img 
                        src={getFileUrl(book.photo_url) || undefined}
                        alt={getBookTitle(book)} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">
                          {book.theme === 'Adventure' ? '🌈' : 
                           book.theme === 'Fantasy' ? '✨' : 
                           book.theme === 'Space' ? '🚀' : 
                           book.theme === 'Animals' ? '🐾' : '📚'}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(book.status)}`}>
                        {getStatusLabel(book.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate">{getBookTitle(book)}</h3>
                    <p className="text-sm text-gray-600">
                      {book.subject} • Age {book.age_category}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created on {formatDate(book.created_at)}
                    </p>
                    
                    <div className="mt-4 flex justify-between">
                      <Button 
                        onClick={() => navigate(`/story/${book.id}`)} 
                        size="sm"
                        variant="outline"
                      >
                        View Details
                      </Button>
                      
                      {book.status === 'complete' && book.pdf_url && (
                        <a 
                          href={getFileUrl(book.pdf_url) || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </a>
                      )}
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
