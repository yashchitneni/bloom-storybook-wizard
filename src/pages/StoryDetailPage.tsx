
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getFileUrl } from '@/utils/storage-utils';
import { ArrowLeft, Clock, Download, Eye } from 'lucide-react';
import Button from '@/components/Button';

interface Storybook {
  id: string;
  theme: string;
  subject: string;
  message: string;
  custom_note: string | null;
  age_category: string;
  style: string;
  created_at: string;
  status: string;
  pdf_url: string | null;
  photo_url: string | null;
}

interface StoryImage {
  id: string;
  page_number: number;
  image_url: string;
}

const StoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const [storyImages, setStoryImages] = useState<StoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user && !localStorage.getItem('supabase.auth.token')) {
      navigate('/auth');
      return;
    }
    
    const fetchStoryDetails = async () => {
      try {
        // Fetch storybook details
        const { data: bookData, error: bookError } = await supabase
          .from('storybooks')
          .select('*')
          .eq('id', id)
          .single();
          
        if (bookError) {
          console.error("Error fetching storybook:", bookError);
          navigate('/account');
          return;
        }
        
        setStorybook(bookData);
        
        // Fetch story images
        const { data: imageData, error: imageError } = await supabase
          .from('story_images')
          .select('*')
          .eq('storybook_id', id)
          .order('page_number', { ascending: true });
          
        if (imageError) {
          console.error("Error fetching story images:", imageError);
          return;
        }
        
        setStoryImages(imageData || []);
      } catch (err) {
        console.error("Error in story details fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchStoryDetails();
    }
  }, [id, user, navigate]);
  
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
          <button 
            onClick={() => navigate('/account')}
            className="flex items-center text-gray-600 hover:text-persimmon mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Storybooks
          </button>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-persimmon"></div>
            </div>
          ) : storybook ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold">{storybook.subject}</h1>
                  <div className="flex items-center">
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(storybook.status)}`}>
                      {getStatusLabel(storybook.status)}
                    </span>
                    {storybook.status === 'pending' && (
                      <span className="ml-2 flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" /> Processing
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-mint/10 rounded-lg overflow-hidden h-64 flex items-center justify-center">
                      {storybook.photo_url ? (
                        <img 
                          src={getFileUrl(storybook.photo_url) || ''} 
                          alt="Story preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-gray-500">Preview not available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      {storybook.pdf_url ? (
                        <Button className="w-full" onClick={() => window.open(getFileUrl(storybook.pdf_url) || '', '_blank')}>
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="w-full">
                          <Clock className="mr-2 h-4 w-4" /> PDF Processing
                        </Button>
                      )}
                      
                      {storybook.status === 'completed' && (
                        <Button variant="outline" className="w-full">
                          <Eye className="mr-2 h-4 w-4" /> Preview Storybook
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Story Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Theme</p>
                        <p className="font-medium">{storybook.theme}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age Range</p>
                        <p className="font-medium">{storybook.age_category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Central Message</p>
                        <p className="font-medium">{storybook.message}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Style</p>
                        <p className="font-medium">{storybook.style}</p>
                      </div>
                    </div>
                    
                    {storybook.custom_note && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Your Personal Note</p>
                        <p className="p-3 bg-gray-50 rounded-md mt-1 text-sm italic">"{storybook.custom_note}"</p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Created On</p>
                      <p className="font-medium">{formatDate(storybook.created_at)}</p>
                    </div>
                  </div>
                </div>
                
                {storyImages.length > 0 && (
                  <div className="mt-10">
                    <h3 className="font-bold text-lg mb-4">Preview Pages</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {storyImages.map((image) => (
                        <div key={image.id} className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={getFileUrl(image.image_url) || ''} 
                            alt={`Page ${image.page_number}`}
                            className="w-full h-full object-cover"
                          />
                          <p className="text-xs text-center py-1 bg-gray-50">Page {image.page_number}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-bold mb-4">Storybook Not Found</h3>
              <p className="mb-6">The storybook you're looking for doesn't exist or you don't have access to view it.</p>
              <Button onClick={() => navigate('/account')}>Back to My Storybooks</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StoryDetailPage;
