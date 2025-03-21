import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://floizrtvdrjbytlgiryj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsb2l6cnR2ZHJqYnl0bGdpcnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTUxNzgsImV4cCI6MjA1ODA3MTE3OH0.Fvq9kQnC_uz0ZqRCv12-auBmaEMWf5GxJbD5HYKzSic';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const uploadImage = async (file, bucket, folder) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}_${Date.now()}.${fileExt}`;
  
      const filePath = `${folder}/${fileName}`;
  
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
  
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
  
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  };

