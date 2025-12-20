export const generateBankTransferContent = () => {
  const now = new Date();

  const date = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  const time = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS

  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 ký tự

  return `BANK-${date}-${time}-${random}`;
};
