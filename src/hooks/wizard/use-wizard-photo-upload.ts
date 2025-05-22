import { useWizardContext } from '@/contexts/WizardContext';
import { uploadFile } from '@/utils/storage-utils';

export const useWizardPhotoUpload = () => {
  const { dispatch } = useWizardContext();

  const handlePhotoUpload = (file: File) => {
    if (file.size === 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'photoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'photoPreview', value: null });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch({ type: 'UPDATE_FIELD', field: 'photoFile', value: file });
      dispatch({ type: 'UPDATE_FIELD', field: 'photoPreview', value: e.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const handleChildPhotoUpload = async (file: File) => {
    if (file.size === 0) {
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: null });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoFile', value: file });
      dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoPreview', value: e.target?.result });
      // Upload to Supabase
      const storagePath = await uploadFile(file, { folder: 'user-uploads/children' });
      if (storagePath) {
        dispatch({ type: 'UPDATE_FIELD', field: 'childPhotoUrl', value: storagePath });
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    handlePhotoUpload,
    handleChildPhotoUpload
  };
};
