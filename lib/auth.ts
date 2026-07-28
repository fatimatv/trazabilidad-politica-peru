export function hasWriteRole(request: Request) {
  const role = request.headers.get("x-demo-role")?.toUpperCase();
  return role === "ADMIN" || role === "ANALYST" || role === "REVIEWER";
}
