import { existsSync, readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { createClient } from '@supabase/supabase-js'

const ARCHIVE_DAYS = 30
const BUCKET = 'invitation-assets'
const args = process.argv.slice(2)
const slug = args.find((arg) => !arg.startsWith('--'))?.trim().toLowerCase()
const confirmedSlug = args.find((arg) => arg.startsWith('--confirm='))?.slice('--confirm='.length)

function loadAdminEnv() {
  if (!existsSync('.env.admin')) return
  for (const rawLine of readFileSync('.env.admin', 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const separator = line.indexOf('=')
    if (separator < 1) continue
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

function fail(message) {
  console.error(`\nGagal: ${message}`)
  process.exit(1)
}

async function listFilesRecursively(supabase, prefix) {
  const files = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (error) throw new Error(`Tidak dapat membaca Storage "${prefix}": ${error.message}`)
    for (const entry of data || []) {
      const path = `${prefix}/${entry.name}`
      if (entry.id) files.push(path)
      else files.push(...await listFilesRecursively(supabase, path))
    }
    if (!data || data.length < 100) break
    offset += data.length
  }
  return files
}

async function removeFiles(supabase, paths) {
  for (let index = 0; index < paths.length; index += 100) {
    const batch = paths.slice(index, index + 100)
    const { error } = await supabase.storage.from(BUCKET).remove(batch)
    if (error) throw new Error(`Tidak dapat menghapus media: ${error.message}`)
  }
}

async function deleteLegacyRows(supabase, table, invitationSlug) {
  const { error } = await supabase.from(table).delete().eq('invitation_slug', invitationSlug)
  if (error && !['42P01', 'PGRST204', 'PGRST205'].includes(error.code)) {
    throw new Error(`Tidak dapat membersihkan tabel ${table}: ${error.message}`)
  }
}

loadAdminEnv()

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail('Gunakan: npm run invitation:purge -- nama-slug')
}

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) {
  fail('Buat .env.admin dari .env.admin.example dan isi SUPABASE_URL serta SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: invitation, error: invitationError } = await supabase
  .from('invitations')
  .select('id,slug,status,expires_at,archived_at')
  .eq('slug', slug)
  .maybeSingle()

if (invitationError) fail(`Tidak dapat membaca undangan: ${invitationError.message}`)
if (!invitation) fail(`Undangan "${slug}" tidak ditemukan.`)

const endedAtValue = invitation.archived_at || invitation.expires_at
if (!endedAtValue) fail('Undangan ini tidak memiliki expires_at atau archived_at, sehingga tidak aman dihapus otomatis.')
const endedAt = new Date(endedAtValue)
const purgeAfter = new Date(endedAt.getTime() + ARCHIVE_DAYS * 24 * 60 * 60 * 1000)
if (Number.isNaN(endedAt.getTime())) fail('Tanggal arsip/kedaluwarsa tidak valid.')
if (Date.now() < purgeAfter.getTime()) {
  fail(`Masa arsip belum 30 hari. Penghapusan baru diizinkan setelah ${purgeAfter.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}.`)
}

console.log('\nUndangan yang akan dihapus permanen:')
console.log(`  Slug       : ${invitation.slug}`)
console.log(`  Status     : ${invitation.status}`)
console.log(`  Berakhir   : ${endedAt.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`)
console.log(`  Folder     : ${BUCKET}/customers/${slug}`)
console.log('  Termasuk   : media, RSVP, ucapan, dan data undangan')

if (confirmedSlug !== slug) {
  const prompt = createInterface({ input, output })
  const answer = await prompt.question(`\nKetik slug "${slug}" untuk mengonfirmasi: `)
  prompt.close()
  if (answer.trim() !== slug) fail('Konfirmasi tidak cocok; tidak ada data yang dihapus.')
}

try {
  const currentFiles = await listFilesRecursively(supabase, `customers/${slug}`)
  const legacyFiles = await listFilesRecursively(supabase, slug)
  const files = [...new Set([...currentFiles, ...legacyFiles])]
  await removeFiles(supabase, files)

  await deleteLegacyRows(supabase, 'rsvp', slug)
  await deleteLegacyRows(supabase, 'wishes', slug)

  const { error: deleteError } = await supabase.from('invitations').delete().eq('id', invitation.id)
  if (deleteError) throw new Error(`Tidak dapat menghapus data undangan: ${deleteError.message}`)

  console.log(`\nSelesai. Undangan "${slug}" dan ${files.length} file media telah dihapus permanen.`)
  console.log('Slug tersebut sekarang dapat digunakan kembali.')
} catch (error) {
  fail(`${error.message} Command aman dijalankan kembali setelah masalah diperbaiki.`)
}
