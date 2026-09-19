import {supabase} from '@/lib/supabaseClient';


// sign up a new user with email and password and
//  store additional metadata in the profiles table
export async function signUpUser({
    email,
    password,
    fullName,
    college,
}:{
    email: string;
    password: string;
    fullName: string;
    college: string;
}) {

    // create a new user in supabase auth and
    // store additional user metadata in the profiles table
    
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data:{
                full_name : fullName,
                college : college || null,

            },
        },
    });
    //return the data and error from the sign up process
    // if there is an error, log it and return null data and the error
    if (error){
        console.error('Sign up error:', error.message);
        return {data: null, error};
    }
    return {data, error: null};

}

export async function signInUser(email: string, password: string){
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error){
        console.error('Sign in error:', error.message);
        return {data : null , error};
    }
    return {data, error: null};

}

export async function signOutUser(){
    const {error} = await supabase.auth.signOut();
    if (error){
        console.error('Sign Out Error:', error.message);
        return {error};
    }
    return {error: null};
}

export async function getCurrentUser(){
    //check the local browser session storage
    const {data: {session} }= await supabase.auth.getSession();
    if (session?.user) return session.user;

    
    //fall back to server authentication check
    const {data: {user}, error} = await supabase.auth.getUser();
    if (error){
        console.error('Get Current User Error:', error.message);
        return {user: null, error};
    }
    return {user, error: null};
}
