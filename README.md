# Eterna Wedding Invitation Templates

A modern, elegant wedding invitation template marketplace built with React, Vite, TailwindCSS, and Supabase.

## 🎯 Features

- Beautiful animated hero section with floating image columns
- Template catalog with filtering (by style) and sorting
- Featured templates showcase
- Responsive design for mobile, tablet, and desktop
- Newsletter subscription functionality
- Smooth animations with Framer Motion
- Supabase backend for data management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Supabase account** - [Create free account](https://supabase.com/)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd C:..\allproject\aMainWebsiteUdangan

# Install dependencies
npm install
```

### 2. Set Up Supabase

#### a. Create Supabase Project

1. Go to [supabase.com](https://supabase.com/)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: eterna-wedding (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait for the project to be ready (usually 1-2 minutes)

#### b. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: https://xyz.supabase.co)
   - **anon public** key

#### c. Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content of `supabase-schema.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success" in the results

#### d. Insert Sample Data (Optional)

1. In the SQL Editor, create a new query
2. Copy the content of `sample-data.sql`
3. Paste and run it
4. This will insert 18 sample templates with prices set to Rp 80.000

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   # Windows (Command Prompt)
   copy .env.example .env

   # Windows (PowerShell)
   Copy-Item .env.example .env

   # Or manually create .env and paste the content from .env.example
   ```

2. Open `.env` in your text editor
3. Replace with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
aMainWebsiteUdangan/
├── public/                 # Static assets (images, fonts)
│   ├── gambar1-15.webp    # Wedding photos
│   ├── flower1-9.webp     # Floral style images
│   ├── classicdark1-9.webp # Classic style images
│   └── jawa1-10.webp      # Javanese style images
├── src/
│   ├── components/        # React components
│   │   ├── HeroGallery.jsx    # Animated hero section
│   │   ├── ImageColumn.jsx    # Animated image columns
│   │   ├── CenterCard.jsx     # Center hero card
│   │   ├── TemplateCard.jsx   # Template card component
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── Footer.jsx         # Footer with newsletter
│   │   ├── FadeIn.jsx         # Fade-in animation wrapper
│   │   ├── Layout.jsx         # Main layout wrapper
│   │   └── FAQItem.jsx        # FAQ accordion item
│   ├── hooks/            # Custom React hooks
│   │   └── useTemplates.js    # Template data fetching
│   ├── lib/              # Utilities
│   │   └── supabase.js        # Supabase client
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx    # Home page
│   │   ├── CatalogPage.jsx    # Template catalog
│   │   ├── TemplateDetails.jsx # Template detail page
│   │   └── AboutFaqPage.jsx   # About & FAQ page
│   ├── App.jsx            # Main app router
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── supabase-schema.sql   # Database schema
├── sample-data.sql       # Sample templates data
├── .env.example          # Environment variables template
├── .env                  # Your actual credentials (not committed)
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── tailwind.config.js    # TailwindCSS configuration
└── vite.config.js        # Vite configuration
```

## 🎨 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗄️ Database Schema

### Templates Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Template name |
| subtitle | TEXT | Short description |
| style | TEXT | Style: Minimalist, Floral, Classic, Modern, Rustic, Bohemian |
| price | INTEGER | Price in IDR (default: 80000) |
| price_display | TEXT | Display price format (e.g., "Rp 80.000") |
| is_featured | BOOLEAN | Show in featured section |
| slug | TEXT | URL-friendly unique identifier |
| images | JSONB | Array of image URLs |
| badge | TEXT | Badge text (e.g., "Best Seller", "New") |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

### Newsletter Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | Subscriber email (unique) |
| created_at | TIMESTAMP | Subscription date |

## 🖼️ Working with Images

### Option 1: Public Folder (Current)

Place images in the `public/` folder and reference them as:
```jsx
<img src="/gambar1.webp" alt="Description" />
```

### Option 2: Supabase Storage (Recommended for Production)

1. In Supabase dashboard, go to **Storage**
2. Create a new bucket named "templates"
3. Upload your images
4. Make the bucket public
5. Use the Supabase Storage API in your code

## 🔧 Troubleshooting

### "net::ERR_NAME_NOT_RESOLVED" Error

This means the Supabase URL cannot be resolved.

**Solutions:**

1. **Check Supabase Project Status**
   - Go to your Supabase dashboard
   - Check if the project is "Restoring", "Suspended", or "Active"
   - If "Restoring", wait for it to complete
   - If "Suspended", upgrade your plan or contact support

2. **Verify Project URL**
   - Go to Settings → API in Supabase
   - Copy the exact Project URL
   - Update `.env` file with the correct URL

3. **Create New Project**
   - If the project is unrecoverable, create a new Supabase project
   - Run `supabase-schema.sql` on the new project
   - Update your `.env` with new credentials

### "404" Errors on API Calls

This means the database tables don't exist or are inaccessible.

**Solutions:**

1. **Run Schema Script**
   - Go to SQL Editor in Supabase
   - Run `supabase-schema.sql` completely
   - Check for any errors in the results

2. **Verify Table Names**
   - Go to **Table Editor** in Supabase
   - Ensure `templates` and `newsletter` tables exist
   - Check that column names match the schema

3. **Check RLS Policies**
   - Go to **Authentication** → **Policies** in Supabase
   - Ensure policies allow public read access
   - Or temporarily disable RLS for testing

### Templates Not Showing

1. **Check Browser Console**
   - Open DevTools (F12)
   - Check for Supabase errors
   - Look for network failures in Network tab

2. **Verify Data Exists**
   - Go to Table Editor in Supabase
   - Open `templates` table
   - Ensure there are rows

3. **Insert Sample Data**
   - Run `sample-data.sql` in SQL Editor
   - This will add 18 sample templates

### Newsletter Subscription Not Working

1. **Check Email Uniqueness**
   - Ensure you're not subscribing the same email twice
   - The `email` column has a unique constraint

2. **Verify Table Exists**
   - Check that `newsletter` table exists in Table Editor

## 📝 Customization

### Change Template Price

To change all template prices:

```sql
-- Update all templates to a new price
UPDATE templates 
SET price = 90000, 
    price_display = 'Rp 90.000';
```

To change individual template price:

```sql
UPDATE templates 
SET price = 100000, 
    price_display = 'Rp 100.000' 
WHERE slug = 'minimalist-elegance';
```

### Add New Styles

Update the style check constraint and UI:

1. In SQL Editor:
   ```sql
   ALTER TABLE templates
   DROP CONSTRAINT templates_style_check;
   
   ALTER TABLE templates
   ADD CONSTRAINT templates_style_check
   CHECK (style IN ('Minimalist', 'Floral', 'Classic', 'Modern', 'Rustic', 'Bohemian', 'YourNewStyle'));
   ```

2. Update `src/pages/CatalogPage.jsx`:
   ```jsx
   const STYLES = ['All', 'Minimalist', 'Floral', 'Classic', 'Modern', 'Rustic', 'Bohemian', 'YourNewStyle']
   ```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **GitHub Pages**
   - Push to GitHub repository
   - Enable GitHub Pages in repo settings
   - Set source to `dist` folder
   - Configure build command: `npm run build`

**Important**: Add your environment variables in the deployment platform's settings!

## 📄 License

This project is private and proprietary.

## 💬 Support

For issues or questions:

1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check React documentation: https://react.dev
4. Check TailwindCSS documentation: https://tailwindcss.com/docs

---

Made with ❤️ for beautiful wedding invitations
