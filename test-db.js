import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('env.txt', 'utf8');
const lines = env.split('\n');
let url = '', key = '';
lines.forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].replace(/"/g, '').trim();
  if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) key = line.split('=')[1].replace(/"/g, '').trim();
});

const supa = createClient(url, key);

(async () => {
  console.log("Checking if Admins can see approved ones...");
  await supa.auth.signInWithPassword({ email: 'crankit694@gmail.com', password: 'LIMS123' });
  const { data: approvedData, error: appError } = await supa.from('testimonials').select('*').eq('approved', true);
  console.log("Approved only:", approvedData ? approvedData.length : 0);

  console.log("Can admin see unapproved?");
  const { data: allData } = await supa.from('testimonials').select('*');
  console.log("Total visible to admin:", allData ? allData.length : 0);
  
})();
