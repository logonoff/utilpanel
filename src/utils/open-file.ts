export const openFile = (
  cb: (content: string) => void,
  accept?: string,
): void => {
  const input = document.createElement('input');
  input.type = 'file';
  if (accept) {
    input.accept = accept;
  }
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        cb(content);
      };
      reader.readAsText(file);
    }
  };
  input.click();
};
