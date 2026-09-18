export interface Profile {
    id: string;
    full_name: string;
    email: string;
    role?: string;
    college?: string | null;
}

export interface Category {
    id: number;
    name: string;
    code: string;

}
export interface Resource {
    id: string;
    title: string;
    desscription: string;
    file_url: string;
    file_type?: string | null;
    category_id: number;
    created_at: string;
    // join relationshhips from database queries 
    categories?: Category;
    profiles?: Profile;
}