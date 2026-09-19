import { supabase } from '@/lib/supabaseClient';
import { Resource } from '@/types';
// fetch all resources along with their associated
//category meta data from the database and 
//order them by creation date in descending order
export async function getResources() {
    const { data, error } = await supabase
        .from('resources')
        .select('*, categories(id, name, code ), profiles(id, full_name, email)').order('created_at', {ascending: false});

    if (error){
        console.error('Error fetching resources:', error.message);
        return {data: null, error};
    }
    return {data: data as Resource[], error: null};
}
// search resources by matcing keywoeds in the title(case insensitive)

export async function searchResources(searchQuery: string){
    const { data, error} = await supabase
        .from('resources')
        .select('*, categories(*)')
        .ilike('title', `%${searchQuery}%`)
        .order('created_at', {ascending: false});

        if (error){
            console.error('Error searching resources:', error.message);
            return {data:null ,error};

        }
        return {data: data as Resource[], error: null};
        
}
// upload raw file to supabase storage bucket and store metadata record in database
// the function takes in a file, title, description, categoryId and userId as parameters
// returns the uploaded resource data or an error if the upload fails
export async function uploadResource({
    file,
    title,
    description,
    categoryId,
    userId,
    onStatusUpdate,
}:{
    file: File;
    title: string;
    description: string;
    categoryId: number;
    userId: string;
    onStatusUpdate?: (status: string) => void;
}){
    const rawExt = file.name.split('.').pop() || 'file';
    const fileExt = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); // sanitize the file extension



    //generate a unique file name using the current timestamp and a random string
    //to avoid same name collisions in the supabase storage bucket
    
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2,7)}.${fileExt}`;
    const filePath = `documents/${fileName}`;
// status update to indicate that the file upload process has started
    onStatusUpdate?.('Uploading file to storage...');


    //uploads physical file to subapase storage bucket
    const {error: uploadError} = await supabase.storage
        .from('academic-files')
        .upload(filePath, file);

    if (uploadError){
        console.error('Storagem upload error:', uploadError.message);
        return { data: null, error: uploadError};
        
    }
    //status update to indicate that the file has been uploaded and
    //  the next step is to save metadata to the database
    onStatusUpdate?.('File uploaded. Saving metadata to database...');
    //get the public download url for file
    const {data: urlData} = supabase.storage
        .from('academic-files')
        .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    //save record matadata to the resource table
    const {data , error: dbError} = await supabase
        .from('resources')
        .insert([
            {
                title,
                description,
                file_url: publicUrl,
                file_type: fileExt,
                category_id: categoryId,
                user_id: userId,


            },
        ])
        .select();


    if (dbError){
        console.error('Database Inser Error:', dbError.message);
        return{ data: null, error: dbError};

    }

    return {data, error: null}


}

