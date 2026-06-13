
// this connects to the backend server, which is running on the local machine at port 8000
export const API_URL = "http://10.212.54.166:8000/api"

// export const API_URL = "http://10.90.251.166:8000/api"
  


// superbase.js credentials
// Note: 1 install run npm install @supabase/supabase-js in the terminal to use the supabase client in this file
//Notw: 2  this jfgyeyicjwiboidvmryh represents the unique identifier for your Supabase project, and sb_publishable_JYJSeyGgpIxr5sqKdbss_A_T6uAOKXt is the public API key that allows your application to interact with the Supabase services. Make sure to keep your API key secure and do not expose it in client-side code in production environments.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpopsjtjprtaouaasozv.supabase.co'
const supabaseKey = 'sb_publishable_NSxIztCpzFU5IemAgbpzqw_ebIf6_Pp'

export const supabase = createClient(supabaseUrl, supabaseKey)




// AIzaSyDYK9lDqQgySv1ydS3rTiyuStp4iQvOAlE

// curl https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDYK9lDqQgySv1ydS3rTiyuStp4iQvOAlE