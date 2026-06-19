import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  const headers = request.headers;

  // ---- GET USER IP ----
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0] ||
    headers.get("x-real-ip") ||
    "Unknown";

  // ---- DEVICE ID COOKIE ----
  const cookies = request.cookies;
  let deviceId = cookies.get("device_id")?.value;

  if (!deviceId) {
    deviceId = uuidv4();
  }

  // ---- DETECT USER AGENT ----
  const userAgent = headers.get("user-agent") || "";

  let browser = "Unknown";
  let os = "Unknown";

  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Edg")) browser = "Edge";

  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "MacOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone")) os = "iOS";

  // ---- GEO LOCATION ----
  let geo = {};

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    geo = await res.json();
  } catch (e) {
    geo = {};
  }

  const response = NextResponse.json({
    deviceId,
    ip,
    browser,
    os,
    geo
  });

  // Set device ID cookie if not exists
  if (!cookies.get("device_id")) {
    response.cookies.set({
      name: "device_id",
      value: deviceId,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}