export const lastUpdated = () => {
  return new Date().toLocaleString('ja', {
    timeZone: 'Asia/Tokyo'
  });
}