/** Extracts and capitalizes the name part of an email: "gopi@istreams.com" -> "Gopi". */
export function getNameFromEmail(email: string): string {
  if (!email) return ''
  const [name] = email.split('@')
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}
