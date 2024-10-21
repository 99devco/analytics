export default function objToQps (paramObj:{}) {
  return Object.entries(paramObj).map(e => e.join("=")).join("&");
}