
const USER_API_URL = '/api/user' 

export async function getMyReservations(token: string | null) {
  const res = await fetch(`${USER_API_URL}/reservations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    
    const errorText = await res.text();
    console.error("Serwer zwrócił błąd w formacie tekstowym/HTML:", errorText);
    throw new Error(`Błąd serwera: ${res.status}`);
  }

  return res.json()
}