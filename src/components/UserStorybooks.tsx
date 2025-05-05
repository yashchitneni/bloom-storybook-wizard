import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Card from "./Card";
import { useStorageBucket } from "@/hooks/use-storage-bucket";
import { getFileUrl } from "@/utils/storage-utils";
import { Storybook } from "@/types/wizard";

export const UserStorybooks = () => {
  const [storybooks, setStorybooks] = useState<Storybook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { isReady } = useStorageBucket('images');

  useEffect(() => {
    if (user && isReady) {
      const fetchStorybooks = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('storybooks')
            .select('*') // Select all columns to avoid missing new fields
            .order('created_at', { ascending: false });

          if (error) {
            console.error("Error fetching storybooks:", error);
          } else if (data) {
            // Process the data to ensure each storybook has all the expected properties
            // even if some are missing from the database
            const processedData = data.map(book => ({
              id: book.id || '',
              author_id: book.author_id,
              theme: book.theme || '',
              subject: book.subject || '',
              message: book.message || '',
              custom_note: book.custom_note,
              age_category: book.age_category || '',
              style: book.style || '',
              child_name: book.child_name || 'Your Child', // Default value if missing
              child_gender: book.child_gender || '', // Default value if missing
              child_photo_url: book.child_photo_url || null, // Default value if missing
              status: book.status || 'draft',
              pdf_url: book.pdf_url,
              photo_url: book.photo_url,
              created_at: book.created_at || new Date().toISOString(),
              moral: book.moral || '' // Default value if missing
            }));
            setStorybooks(processedData);
          }
        } catch (error) {
          console.error("Error in fetchStorybooks:", error);
        }
        setIsLoading(false);
      };

      fetchStorybooks();

      // Subscribe to changes
      const subscription = supabase
        .channel('storybooks_changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'storybooks'
        }, () => {
          fetchStorybooks();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, isReady]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Your Storybooks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="h-60 bg-gray-100 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (storybooks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Your Storybooks</h2>
        <Card className="p-8 text-center">
          <p>You haven't created any storybooks yet.</p>
          <p className="text-muted-foreground mt-2">
            Use the wizard above to create your first personalized story!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Your Storybooks</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {storybooks.map((book) => (
          <Card key={book.id} className="overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {book.photo_url ? (
                <img 
                  src={getFileUrl(book.photo_url)} 
                  alt={`${book.child_name}'s storybook`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl">{book.style === 'Cartoon' ? '🎨' : book.style === 'Watercolor' ? '🌈' : book.style === '3D' ? '🧩' : '🎭'}</div>
              )}
            </div>
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{book.theme} Adventure</h3>
                <div className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(book.status)}`}>
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                For {book.child_name}, teaching {book.moral || 'important lessons'}
              </p>
              <p className="text-xs mt-4">
                Created {new Date(book.created_at).toLocaleDateString()}
              </p>
            </div>
            {book.status === 'done' && (
              <div className="p-4 pt-0">
                <button className="w-full py-2 text-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Download PDF
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function
const getStatusColor = (status: string) => {
  switch (status) {
    case 'processing':
      return 'bg-amber-500';
    case 'done':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};
