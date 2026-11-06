function formatRooms(count) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} комнат`;
  }

  if (lastDigit === 1) {
    return `${count} комната`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} комнаты`;
  }

  return `${count} комнат`;
}

export default formatRooms;