import bcrypt from 'bcryptjs';
import { supabase, generateId } from '../database/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function createSuperAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node create-superadmin.js <email> <password> <name>');
    console.log('Example: node create-superadmin.js admin@saas.com password123 "SaaS Owner"');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    // Check if super admin already exists
    const { data: existing } = await supabase
      .from('SuperAdmin')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      console.error('❌ Super admin with this email already exists!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const superAdminId = generateId();
    const { data: superAdmin, error } = await supabase
      .from('SuperAdmin')
      .insert({
        id: superAdminId,
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating super admin:', error);
      process.exit(1);
    }

    console.log('✅ Super admin created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nYou can now login at: POST /api/auth/superadmin/login');
    console.log('Or use the frontend when it\'s updated to support super admin login.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();

