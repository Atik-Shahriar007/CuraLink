const DAILY_API_BASE = "https://api.daily.co/v1";

function dailyHeaders() {
  return {
    Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function getOrCreateRoom(consultationId: string): Promise<string> {
  const roomName = `consultation-${consultationId}`;

  // Try to fetch an existing room first
  const getRes = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
    headers: dailyHeaders(),
  });

  if (getRes.ok) {
    return roomName;
  }

  // Doesn't exist yet — create it
  const createRes = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify({
      name: roomName,
      privacy: "private", // only accessible via a signed meeting token
      properties: {
        enable_chat: false, // we're using Pusher for chat, not Daily's built-in
        eject_at_room_exp: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3, // room expires 3 hours from creation
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Daily room: ${err}`);
  }

  return roomName;
}

export async function createMeetingToken(
  roomName: string,
  userName: string,
  isOwner: boolean
): Promise<string> {
  const res = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
    method: "POST",
    headers: dailyHeaders(),
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner, // doctor gets owner privileges
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // token valid 2 hours
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create meeting token: ${err}`);
  }

  const data = await res.json();
  return data.token;
}