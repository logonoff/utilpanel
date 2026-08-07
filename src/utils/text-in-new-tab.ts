export const openTextInNewTab = (
  text: string,
  mime: string = 'text/plain;charset=utf-8',
) => {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
