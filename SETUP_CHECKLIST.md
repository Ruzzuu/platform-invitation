# Quick Setup Checklist

Use this checklist to quickly set up your Eterna Wedding Templates project.

## ✅ Phase 1: Project Setup

- [ ] Navigate to project directory: `cd C:\Users\fairu\home\allproject\aMainWebsiteUdangan`
- [ ] Run: `npm install`
- [ ] Verify .env file exists (should be created automatically)

## ✅ Phase 2: Supabase Setup

### Option A: Fix Existing Project (Recommended)

- [ ] Go to https://supabase.com/
- [ ] Sign in and navigate to your project
- [ ] Check project status (should be "Active")
- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy anon public key
- [ ] Update `.env` file with these credentials
- [ ] Go to SQL Editor
- [ ] Open `supabase-schema.sql` from this project
- [ ] Copy and run the entire script
- [ ] Verify "Success" message appears
- [ ] (Optional) Run `sample-data.sql` to insert 18 sample templates

### Option B: Create New Project

- [ ] Go to https://supabase.com/ and create account
- [ ] Click "New Project"
- [ ] Fill in project details
- [ ] Wait for project to be ready (1-2 minutes)
- [ ] Go to Settings → API
- [ ] Copy Project URL and anon key
- [ ] Update `.env` file with new credentials
- [ ] Run `supabase-schema.sql` in SQL Editor
- [ ] Run `sample-data.sql` to add sample data

## ✅ Phase 3: Test the Application

- [ ] Run: `npm run dev`
- [ ] Open http://localhost:5173 in browser
- [ ] Check that homepage loads without errors
- [ ] Scroll down to see "Template Collections" section
- [ ] Click "View All Templates" to see catalog
- [ ] Try filtering by style (Minimalist, Floral, etc.)
- [ ] Try sorting options (Featured, Price, Newest)
- [ ] Test pagination
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab - should be no errors
- [ ] Check Network tab - verify Supabase API calls return data
- [ ] Test newsletter subscription in footer
- [ ] Check that prices show "Rp 80.000"

## ✅ Phase 4: Verify Database

- [ ] Go to Supabase Dashboard
- [ ] Navigate to Table Editor
- [ ] Verify `templates` table exists
- [ ] Verify `newsletter` table exists
- [ ] Check `templates` table has data (if sample-data.sql was run)
- [ ] Verify all prices are set to 80000
- [ ] Verify price_display shows "Rp 80.000"

## 🔍 Common Issues & Solutions

### Issue: "net::ERR_NAME_NOT_RESOLVED"

**Solution:**
- Check Supabase project status
- Verify Project URL in `.env` matches Supabase dashboard
- Try creating new Supabase project if current is unrecoverable

### Issue: "Failed to load resource: 404"

**Solution:**
- Run `supabase-schema.sql` completely in SQL Editor
- Check that tables exist in Table Editor
- Verify RLS policies allow public access

### Issue: Templates not showing

**Solution:**
- Run `sample-data.sql` to add data
- Check browser Console for errors
- Check Network tab for failed API calls

### Issue: Newsletter subscription fails

**Solution:**
- Ensure email is not already subscribed
- Verify `newsletter` table exists
- Check for duplicate email errors in Console

## 📚 Additional Resources

- Full documentation: See `README.md`
- Supabase docs: https://supabase.com/docs
- React docs: https://react.dev
- TailwindCSS docs: https://tailwindcss.com/docs
- Framer Motion docs: https://www.framer.com/motion/

## 🆘 Need Help?

1. Check the Troubleshooting section in README.md
2. Review error messages in browser Console (F12)
3. Check Network tab in DevTools for API errors
4. Verify Supabase dashboard for project status

## ✨ Next Steps

Once everything is working:

- [ ] Customize the hero section images in `src/components/HeroGallery.jsx`
- [ ] Add your own templates to the database
- [ ] Update pricing as needed
- [ ] Customize colors and fonts in `tailwind.config.js`
- [ ] Deploy to production (see README.md for deployment options)
- [ ] Add your own images to `public/` folder or Supabase Storage

---

**Estimated Setup Time:** 15-30 minutes

**Note:** The development server is already running at http://localhost:5173 - just refresh your browser after completing the Supabase setup!
