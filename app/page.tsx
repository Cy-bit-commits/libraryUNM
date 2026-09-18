"use client"; // Required to use useEffect

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Adjust this path to match your project structure
import {getResources} from '@/services/resourceService'


export default function Home() {
  useEffect(() => {

    async function fetchResources(){
      const {data, error} = await getResources();
      console.log("fetched data:", data);
      console.log('fetched error:', error);
    }
    // Log the Supabase object to verify initialization
    console.log("Supabase Object:", supabase);
    
  }, []);

  return (
    <main>
      <h1>debuggggs</h1>
    </main>
  );
}
